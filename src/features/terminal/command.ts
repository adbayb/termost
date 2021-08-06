import { DEFAULT_COMMAND_KEY, globalContext } from "../../context";
import { TaskManager } from "../../core/taskManager";
import { Dictionary } from "../../core/dictionary";
import { system } from "../system";
import { OptionExecutorInput, OptionHandler } from "./executors/option";
import { QuestionExecutorInput, QuestionHandler } from "./executors/question";
import { TaskExecutorInput, TaskHandler } from "./executors/task";
import { Executor, ExecutorInput } from "./executors/types";
import { CommandMetadata } from "./types";

export class Command {
	#name: string | undefined;
	#manager: TaskManager;
	#data: Dictionary;
	#metadata: CommandMetadata;

	constructor(name: string, description: string) {
		this.#name = name;
		this.#data = new Dictionary();
		this.#manager = new TaskManager();
		this.#metadata = {
			description,
			options: {},
		};

		// @note: bootstrap core options
		this.option({
			name: "help",
			description: "Display the help center",
		}).option({
			name: "version",
			description: "Print the version",
		});

		// @note: if the user command doesn't match the the command instance name, then do not execute the command
		if (globalContext.currentCommand === this.#name) {
			// @note: setTimeout 0 allows to run activation logic in the next event loop iteration.
			// It'll allow to make sure that the `globalContext` is correctly filled with all commands
			// metadata (especially to let the global help option to display all available commands):
			setTimeout(() => this.#enable(), 0);
		}
	}

	option(params: OptionExecutorInput) {
		this.#manager.register(
			this.#createTask(
				new OptionHandler({ ...params, metadata: this.#metadata }),
				params.skip
			)
		);

		return this;
	}

	question(params: QuestionExecutorInput) {
		this.#manager.register(
			this.#createTask(new QuestionHandler(params), params.skip)
		);

		return this;
	}

	task({ skip, handler, ...restParams }: TaskExecutorInput) {
		this.#manager.register(
			this.#createTask(
				new TaskHandler({
					...restParams,
					handler: () => {
						return handler(this.#data.values());
					},
				}),
				skip
			)
		);

		return this;
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

		return this.#manager.start();
	}

	#help() {
		const { description, options } = this.#metadata;
		const optionKeys = Object.keys(options);
		const hasOption = optionKeys.length > 0;
		const hasCommands =
			this.#name === DEFAULT_COMMAND_KEY &&
			globalContext.commandRegistry.length > 0;
		const printTitle = (message: string) =>
			system.print(`\n${message}:`, {
				color: "yellow",
				modifier: ["bold", "underline", "uppercase"],
			});
		const printLabelValue = (label: string, value: string) =>
			system.print(
				`  ${system.format(label.padEnd(10, " "), {
					color: "green",
				})} ${value}`
			);

		printTitle("Usage");
		system.print(
			`${system.format(
				`${process.argv0}${hasCommands ? "" : ` ${this.#name}`}`,
				{
					color: "green",
				}
			)} ${hasCommands ? "<command> " : ""}${
				hasOption ? "[options]" : ""
			}`
		);

		printTitle("Description");
		system.print(description);

		if (hasOption) {
			printTitle("Options");

			for (const key of optionKeys) {
				printLabelValue(key, options[key] as string);
			}
		}

		if (hasCommands) {
			printTitle("Commands");

			for (const { name, description } of globalContext.commandRegistry) {
				printLabelValue(name, description);
			}
		}
	}

	#version() {
		console.info("TODO: version");
	}

	#createTask(executor: Executor, skip: ExecutorInput["skip"]) {
		return async () => {
			if (skip?.(this.#data.values())) {
				return;
			}

			const { name, value } = await executor.execute();

			this.#data.set(name, value);
		};
	}
}
