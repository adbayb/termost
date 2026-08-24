import { styleText } from "node:util";
import { intro, outro } from "@clack/prompts";
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

export const createCommand = (
	{ name, description }: CommandParameters,
	metadata: ProgramMetadata,
) => {
	const { name: rootCommandName, argv, version } = metadata;
	const isRootCommand = name === rootCommandName;
	const isActiveCommand = argv.command === name;
	const controller = createCommandController<ObjectLikeConstraint>(name, description);
	const rootController = getCommandController(rootCommandName);

	/*
	 * Timeout to force evaluating help output at the end of the program instructions chaining.
	 * It allows collecting all needed input to fill the output:
	 */
	setTimeout(() => {
		/**
		 * By design, the root command instructions are always executed even with subcommands (to
		 * share options, messages...).
		 */
		if (isRootCommand && !isActiveCommand) {
			void rootController.enable();
		}

		// Enable the current active command instructions:
		if (isActiveCommand) {
			/**
			 * SetTimeout 0 allows to run activation logic in the next event loop iteration. It'll
			 * allow to make sure that the `metadata` is correctly filled with all commands metadata
			 * (especially to let the global help option to display all available commands).
			 */
			const optionKeys = Object.keys(argv.options);

			if (
				optionKeys.includes(OPTION_VERSION_NAMES[0]) ||
				optionKeys.includes(OPTION_VERSION_NAMES[1])
			) {
				console.info(version);

				return;
			}

			const help = () => {
				showHelp({
					controller,
					currentCommandName: name,
					isRootCommand,
					rootCommandName,
				});
			};

			if (
				optionKeys.includes(OPTION_HELP_NAMES[0]) ||
				optionKeys.includes(OPTION_HELP_NAMES[1])
			) {
				help();

				return;
			}

			if (metadata.isEmptyCommand[name]) {
				// Show help by default if no processing is done for the current command
				help();
			} else {
				const runCommand = async () => {
					const showIntroOutro = metadata.hasInteractiveInstruction;
					const startCommandTime = performance.now();

					if (showIntroOutro) {
						intro(`${rootCommandName} ${styleText("dim", `v${version}`)}`);
					}

					await controller.enable();

					if (showIntroOutro) {
						const elapsed = Math.round(performance.now() - startCommandTime);

						const duration =
							elapsed < 1000 ? `${elapsed}ms` : `${(elapsed / 1000).toFixed(2)}s`;

						outro(styleText("dim", `Done in ${duration}`));
					}
				};

				void runCommand();
			}
		}
	}, 0);

	return name;
};

const OPTION_HELP_NAMES = ["help", "h"] as const;
const OPTION_VERSION_NAMES = ["version", "v"] as const;

const showHelp = ({
	controller,
	currentCommandName,
	isRootCommand,
	rootCommandName,
}: {
	// oxlint-disable-next-line @typescript-eslint/no-explicit-any
	controller: CommandController<any>;
	currentCommandName: string;
	isRootCommand: boolean;
	rootCommandName: string;
}) => {
	const commandMetadata = controller.getMetadata(rootCommandName);
	const { description, options } = commandMetadata;
	const commands = getCommandDescriptionCollection();
	const optionKeys = Object.keys(commandMetadata.options);
	const commandKeys = Object.keys(commands);
	const hasOptions = optionKeys.length > 0;
	const hasCommands = isRootCommand && commandKeys.length > 1;

	printTitle("Usage");

	print(
		`${styleText("green", `${rootCommandName}${isRootCommand ? "" : ` ${currentCommandName}`}`)} ${hasCommands ? "<command> " : ""}${hasOptions ? "[…options]" : ""}`,
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
			if (name === rootCommandName) {
				continue;
			}

			const commandDescription = commands[name];

			if (commandDescription) {
				printLabelValue(name, commandDescription, padding);
			}
		}
	}

	if (hasOptions) {
		printTitle("Options");

		for (const key of optionKeys) {
			printLabelValue(key, options[key] as string, padding);
		}
	}
};

const print = (message: string) => {
	console.log(message);
};

const printTitle = (message: string) => {
	print(styleText(["bold", "underline", "yellow"], `\n${message.toUpperCase()}:`));
};

const printLabelValue = (label: string, value: string, padding: number) => {
	print(`  ${styleText("green", label.padEnd(padding + 1, " "))} ${value}`);
};
