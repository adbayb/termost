/* eslint-disable sonarjs/cognitive-complexity */
import { format } from "../../helpers/stdout";
import type { ObjectLikeConstraint, ProgramMetadata } from "../../types";

import type { CommandController } from "./controller";
import {
	createCommandController,
	getCommandController,
	getCommandDescriptionCollection,
} from "./controller";

export type CommandParameters = {
	name: string;
	description: string;
};

export const createCommand = <Values extends ObjectLikeConstraint>(
	{ name, description }: CommandParameters,
	{ argv, name: rootCommandName, version }: ProgramMetadata,
) => {
	const isRootCommand = name === rootCommandName;
	const isActiveCommand = argv.command === name;
	const controller = createCommandController<Values>(name, description);
	const rootController = getCommandController(rootCommandName);

	setTimeout(() => {
		// @note: By design, the root command instructions are always executed
		// even with subcommands (to share options, messages...)
		if (isRootCommand && !isActiveCommand) {
			void rootController.enable();
		}

		// @note: enable the current active command instructions:
		if (isActiveCommand) {
			// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
			// It'll allow to make sure that the `metadata` is correctly filled with all commands
			// metadata (especially to let the global help option to display all available commands):
			const optionKeys = Object.keys(argv.options);

			if (
				optionKeys.includes(OPTION_HELP_NAMES[0]) ||
				optionKeys.includes(OPTION_HELP_NAMES[1])
			) {
				showHelp({
					controller,
					currentCommandName: name,
					isRootCommand,
					rootCommandName,
				});

				return;
			}

			if (
				optionKeys.includes(OPTION_VERSION_NAMES[0]) ||
				optionKeys.includes(OPTION_VERSION_NAMES[1])
			) {
				console.info(version);

				return;
			}

			void controller.enable();
		}
	}, 0);

	return name;
};

const OPTION_HELP_NAMES = ["help", "h"] as const;
const OPTION_VERSION_NAMES = ["version", "v"] as const;

const showHelp = ({
	rootCommandName,
	currentCommandName,
	isRootCommand,
	controller,
}: {
	rootCommandName: string;
	currentCommandName: string;
	isRootCommand: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	controller: CommandController<any>;
}) => {
	const commandMetadata = controller.getMetadata(rootCommandName);
	const { options, description } = commandMetadata;
	const commands = getCommandDescriptionCollection();
	const optionKeys = Object.keys(commandMetadata.options);
	const commandKeys = Object.keys(commands);
	const hasOptions = optionKeys.length > 0;
	const hasCommands = isRootCommand && commandKeys.length > 1;

	printTitle("Usage");
	print(
		`${format(
			`${rootCommandName}${
				isRootCommand ? "" : ` ${String(currentCommandName)}`
			}`,
			{
				color: "green",
			},
		)} ${hasCommands ? "<command> " : ""}${
			hasOptions ? "[...options]" : ""
		}`,
	);

	if (description) {
		printTitle("Description");
		print(description);
	}

	const padding = [...commandKeys, ...optionKeys].reduce((value, item) => {
		return Math.max(value, item.length);
	}, 0);

	if (hasCommands) {
		printTitle("Commands");

		for (const name of commandKeys) {
			if (name === rootCommandName) continue;

			const commandDescription = commands[name];

			if (commandDescription)
				printLabelValue(name, commandDescription, padding);
		}
	}

	if (hasOptions) {
		printTitle("Options");

		for (const key of optionKeys) {
			printLabelValue(key, options[key] as string, padding);
		}
	}
};

const print = (...parameters: Parameters<typeof format>) => {
	console.log(format(...parameters));
};

const printTitle = (message: string) => {
	print(`\n${message}:`, {
		color: "yellow",
		modifier: ["bold", "underline", "uppercase"],
	});
};

const printLabelValue = (label: string, value: string, padding: number) => {
	print(
		`  ${format(label.padEnd(padding + 1, " "), {
			color: "green",
		})} ${value}`,
	);
};
