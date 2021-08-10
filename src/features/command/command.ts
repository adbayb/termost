import { DEFAULT_COMMAND_KEY, globalContext } from "../../context";
import { AsyncQueue } from "../../core/queue";
import { format } from "../message/helpers";
import { FluentInterface } from "./fluentInterface";

export class Command extends FluentInterface {
	#name: string | undefined;

	constructor(name: string, description: string) {
		super({
			instructionManager: new AsyncQueue(),
			metadata: {
				description,
				options: {},
			},
		});

		this.#name = name;
		this.option({
			name: "help",
			description: "Display the help center",
		}).option({
			name: "version",
			description: "Print the version",
		});

		setTimeout(() => {
			// @note: if the user command doesn't match the the command instance name, then do not execute the command
			if (globalContext.currentCommand === this.#name) {
				// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
				// It'll allow to make sure that the `globalContext` is correctly filled with all commands
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
		const reservedOption = Object.keys(globalContext.options).find(
			(userOption) => ["help", "version"].includes(userOption)
		);

		if (reservedOption === "help") {
			return this.#help();
		}

		if (reservedOption === "version") {
			return this.#version();
		}

		this.instructionManager.traverse();
	}

	#help() {
		const { description, options } = this.metadata;
		const optionKeys = Object.keys(options);
		const hasOption = optionKeys.length > 0;
		const hasCommands =
			this.#name === DEFAULT_COMMAND_KEY &&
			globalContext.commandRegistry.length > 0;
		const print = (...parameters: Parameters<typeof format>) =>
			console.log(format(...parameters));
		const printTitle = (message: string) =>
			print(`\n${message}:`, {
				color: "yellow",
				modifier: ["bold", "underline", "uppercase"],
			});
		const printLabelValue = (label: string, value: string) =>
			print(
				`  ${format(label.padEnd(10, " "), {
					color: "green",
				})} ${value}`
			);

		printTitle("Usage");
		print(
			`${format(
				`${process.argv0}${hasCommands ? "" : ` ${this.#name}`}`,
				{
					color: "green",
				}
			)} ${hasCommands ? "<command> " : ""}${
				hasOption ? "[...options]" : ""
			}`
		);

		printTitle("Description");
		print(description);

		if (hasCommands) {
			printTitle("Commands");

			for (const { name, description } of globalContext.commandRegistry) {
				printLabelValue(name, description);
			}
		}

		if (hasOption) {
			printTitle("Options");

			for (const key of optionKeys) {
				printLabelValue(key, options[key] as string);
			}
		}
	}

	#version() {
		console.info("TODO: version");
	}
}
