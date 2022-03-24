import { ROOT_COMMAND_NAME } from "../../constants";
import { AsyncQueue } from "../../helpers/queue";
import { format } from "../message/helpers";
import { CommandName, Context, ObjectLikeConstraint } from "../types";

export type CommandParameters = {
	name: string;
	description: string;
};

type InternalCommandParameters<Values extends ObjectLikeConstraint> =
	CommandParameters & {
		context: Context<Values>;
		managers: ManagerCollection;
	};

type ManagerCollection = Record<CommandName, AsyncQueue>;

export const createCommand = <Values extends ObjectLikeConstraint>({
	name,
	description,
	context,
	managers,
}: InternalCommandParameters<Values>) => {
	const { commands, args } = context;
	const isRootCommand = name === ROOT_COMMAND_NAME;
	const isActiveCommand = args.command === name;

	managers[name] = new AsyncQueue();
	commands[name] = description;

	setTimeout(() => {
		// @note: By design, the root command instructions are always executed
		// even with subcommands (to share options, messages...)
		if (isRootCommand && !isActiveCommand) {
			managers[ROOT_COMMAND_NAME]!.traverse();
		}

		// @note: enable the current active command instructions:
		if (isActiveCommand) {
			// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
			// It'll allow to make sure that the `context` is correctly filled with all commands
			// metadata (especially to let the global help option to display all available commands):
			const { options } = args;

			if (
				OPTION_HELP_NAMES[0] in options ||
				OPTION_HELP_NAMES[1] in options
			) {
				return showHelp(context, {
					currentCommand: name,
					isRootCommand,
				});
			}

			if (
				OPTION_VERSION_NAMES[0] in options ||
				OPTION_VERSION_NAMES[1] in options
			) {
				return showVersion(context);
			}

			managers[name]!.traverse();
		}
	}, 0);

	return name;
};

export const OPTION_HELP_NAMES = ["help", "h"] as const;

export const OPTION_VERSION_NAMES = ["version", "v"] as const;

const showVersion = <Values extends ObjectLikeConstraint>(
	context: Context<Values>
) => {
	console.info(context.version);
};

const showHelp = <Values extends ObjectLikeConstraint>(
	context: Context<Values>,
	{
		currentCommand,
		isRootCommand,
	}: { currentCommand: string; isRootCommand: boolean }
) => {
	const { args, commands, name: programName, options } = context;
	const description = commands[args.command];
	const optionKeys = Object.keys(options);
	const hasOption = optionKeys.length > 0;
	const hasCommands = isRootCommand && Object.keys(commands).length > 0;

	const rawPrint = (...parameters: Parameters<typeof format>) =>
		console.log(format(...parameters));

	const printTitle = (message: string) =>
		rawPrint(`\n${message}:`, {
			color: "yellow",
			modifier: ["bold", "underline", "uppercase"],
		});

	const printLabelValue = (label: string, value: string, padding: number) =>
		rawPrint(
			`  ${format(label.padEnd(padding + 1, " "), {
				color: "green",
			})} ${value}`
		);

	printTitle("Usage");
	rawPrint(
		`${format(
			`${programName}${
				isRootCommand ? "" : ` ${String(currentCommand)}`
			}`,
			{
				color: "green",
			}
		)} ${hasCommands ? "<command> " : ""}${hasOption ? "[...options]" : ""}`
	);

	if (description) {
		printTitle("Description");
		rawPrint(description);
	}

	const padding = [...Object.keys(commands), ...optionKeys].reduce(
		(padding, item) => {
			return Math.max(padding, item.length);
		},
		0
	);

	if (hasCommands) {
		printTitle("Commands");

		for (const name in commands) {
			const description = commands[name];

			if (description) printLabelValue(name, description, padding);
		}
	}

	if (hasOption) {
		printTitle("Options");

		for (const key of optionKeys) {
			printLabelValue(key, options[key] as string, padding);
		}
	}
};
