import { DEFAULT_COMMAND_NAME } from "../../constants";
import { format } from "../message/helpers";
import { CommandName, Context, ObjectLikeConstraint } from "../types";
import { FluentInterface } from "./fluentInterface";

export class Command<
	Values extends ObjectLikeConstraint
> extends FluentInterface<Values> {
	/**
	 * The command instance name used as unique identifier
	 */
	#name: CommandName;
	/**
	 * True if the command instance name corresponds to the root command name.
	 * False otherwise.
	 */
	#isRoot: boolean;
	/**
	 * True if the current user command matches the command instance name.
	 * False otherwise.
	 */
	#isActive: boolean;

	constructor(
		name: CommandName,
		description: string,
		context: Context<Values>
	) {
		super(context);

		this.#name = name;
		this.#isRoot = this.#name === DEFAULT_COMMAND_NAME;
		this.#isActive = this.context.args.command === this.#name;
		this.context.commands[name] = description;
		this.option({
			name: { long: OPTION_HELP_NAMES[0], short: OPTION_HELP_NAMES[1] },
			description: "Display the help center",
		} as any).option({
			name: {
				long: OPTION_VERSION_NAMES[0],
				short: OPTION_VERSION_NAMES[1],
			},
			description: "Print the version",
		} as any);

		setTimeout(() => {
			// @note: By design, the root command instructions are always executed
			// even with subcommands (to share options, messages...)
			if (this.#isRoot && !this.#isActive) {
				this.manager.traverse();
			}

			// @note: enable the current active command instructions:
			if (this.#isActive) {
				// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
				// It'll allow to make sure that the `context` is correctly filled with all commands
				// metadata (especially to let the global help option to display all available commands):
				this.#enable();
			}
		}, 0);
	}

	/**
	 * Enables the command by processing all executors (options, pending tasks...)
	 * @returns The disable function to stop tasks and unregister the command on the fly
	 */
	async #enable() {
		const { options } = this.context.args;

		if (
			OPTION_HELP_NAMES[0] in options ||
			OPTION_HELP_NAMES[1] in options
		) {
			return this.#showHelp();
		}

		if (
			OPTION_VERSION_NAMES[0] in options ||
			OPTION_VERSION_NAMES[1] in options
		) {
			return this.#showVersion();
		}

		this.manager.traverse();
	}

	#showHelp() {
		const { args, commands, name: programName, options } = this.context;
		const description = commands[args.command];
		const optionKeys = Object.keys(options);
		const hasOption = optionKeys.length > 0;
		const hasCommands = this.#isRoot && Object.keys(commands).length > 0;

		const rawPrint = (...parameters: Parameters<typeof format>) =>
			console.log(format(...parameters));

		const printTitle = (message: string) =>
			rawPrint(`\n${message}:`, {
				color: "yellow",
				modifier: ["bold", "underline", "uppercase"],
			});

		const printLabelValue = (
			label: string,
			value: string,
			padding: number
		) =>
			rawPrint(
				`  ${format(label.padEnd(padding + 1, " "), {
					color: "green",
				})} ${value}`
			);

		printTitle("Usage");
		rawPrint(
			`${format(
				`${programName}${this.#isRoot ? "" : ` ${String(this.#name)}`}`,
				{
					color: "green",
				}
			)} ${hasCommands ? "<command> " : ""}${
				hasOption ? "[...options]" : ""
			}`
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
	}

	#showVersion() {
		console.info(this.context.version);
	}
}

const OPTION_HELP_NAMES = ["help", "h"] as const;
const OPTION_VERSION_NAMES = ["version", "v"] as const;
