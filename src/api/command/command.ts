/* eslint-disable sonarjs/cognitive-complexity */
import { format } from "../message/helpers";
import { Metadata } from "../../types";
import {
	CommandController,
	createCommandController,
	getCommandController,
	getCommandDescriptionCollection,
} from "./controller";

export type CommandParameters = {
	name: string;
	description: string;
};

type InternalCommandParameters = CommandParameters & {
	metadata: Metadata;
};

export const createCommand = ({
	name,
	description,
	metadata,
}: InternalCommandParameters) => {
	const { args, name: rootCommandName } = metadata;
	const isRootCommand = name === rootCommandName;
	const isActiveCommand = args.command === name;
	const controller = createCommandController(name, description);
	const rootController = getCommandController(rootCommandName);

	setTimeout(() => {
		// @note: By design, the root command instructions are always executed
		// even with subcommands (to share options, messages...)
		if (isRootCommand && !isActiveCommand) {
			rootController.enable();
		}

		// @note: enable the current active command instructions:
		if (isActiveCommand) {
			// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
			// It'll allow to make sure that the `metadata` is correctly filled with all commands
			// metadata (especially to let the global help option to display all available commands):
			const { options } = args;
			const optionKeys = Object.keys(options);

			if (
				optionKeys.includes(OPTION_HELP_NAMES[0]) ||
				optionKeys.includes(OPTION_HELP_NAMES[1])
			) {
				return showHelp(metadata, {
					currentCommandName: name,
					isRootCommand,
					controller,
				});
			}

			if (
				optionKeys.includes(OPTION_VERSION_NAMES[0]) ||
				optionKeys.includes(OPTION_VERSION_NAMES[1])
			) {
				return showVersion(metadata);
			}

			controller.enable();
		}
	}, 0);

	return name;
};

const OPTION_HELP_NAMES = ["help", "h"] as const;
const OPTION_VERSION_NAMES = ["version", "v"] as const;

const showVersion = (metadata: Metadata) => {
	console.info(metadata.version);
};

const showHelp = (
	metadata: Metadata,
	{
		currentCommandName,
		isRootCommand,
		controller,
	}: {
		currentCommandName: string;
		isRootCommand: boolean;
		controller: CommandController;
	}
) => {
	const { name: programName } = metadata;
	const commandMetadata = controller.getMetadata(programName);
	// const rootCommandMetadata = controller.getMetadata();
	const { options, description } = commandMetadata;
	const commands = getCommandDescriptionCollection();
	const optionKeys = Object.keys(commandMetadata.options);
	const commandKeys = Object.keys(commands);
	const hasOptions = optionKeys.length > 0;
	const hasCommands = isRootCommand && commandKeys.length > 1;

	printTitle("Usage");
	print(
		`${format(
			`${programName}${
				isRootCommand ? "" : ` ${String(currentCommandName)}`
			}`,
			{
				color: "green",
			}
		)} ${hasCommands ? "<command> " : ""}${
			hasOptions ? "[...options]" : ""
		}`
	);

	if (description) {
		printTitle("Description");
		print(description);
	}

	const padding = [...commandKeys, ...optionKeys].reduce((padding, item) => {
		return Math.max(padding, item.length);
	}, 0);

	if (hasCommands) {
		printTitle("Commands");

		for (const name of commandKeys) {
			if (name === programName) continue;

			const description = commands[name];

			if (description) printLabelValue(name, description, padding);
		}
	}

	if (hasOptions) {
		printTitle("Options");

		for (const key of optionKeys) {
			printLabelValue(key, options[key] as string, padding);
		}
	}
};

const print = (...parameters: Parameters<typeof format>) =>
	console.log(format(...parameters));

const printTitle = (message: string) =>
	print(`\n${message}:`, {
		color: "yellow",
		modifier: ["bold", "underline", "uppercase"],
	});

const printLabelValue = (label: string, value: string, padding: number) =>
	print(
		`  ${format(label.padEnd(padding + 1, " "), {
			color: "green",
		})} ${value}`
	);
