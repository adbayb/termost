import { globalContext } from "../../context";
import { TaskManager } from "../../core/taskManager";
import { Dictionary } from "../../core/dictionary";
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
	enable() {
		const disable = () => {
			console.log("called");
			this.#manager.stop();
		};

		// @note: if the user command doesn't match the the command instance name, then do not execute the command
		if (globalContext.command !== this.#name) {
			return disable;
		}

		const reservedOption = Object.keys(globalContext.options).find(
			(userOption) =>
				RESERVED_OPTIONS.includes(
					userOption as typeof RESERVED_OPTIONS[number]
				)
		);

		if (reservedOption) {
			if (reservedOption === "help") {
				this.#help();
			} else if (reservedOption === "version") {
				this.#version();
			}

			return disable;
		}

		const run = async () => {
			await this.#manager.start();

			console.info("Data = ", this.#data.values());
			console.info(
				"Metadata = ",
				JSON.stringify(this.#metadata, null, 4)
			);
		};

		run();

		return disable;
	}

	#help() {
		const { description, options } = this.#metadata;
		const optionKeys = Object.keys(options);
		const hasOption = optionKeys.length > 0;
		const parts: Array<string> = [];

		parts.push("Usage:");
		// @todo: handle subcommands from program
		// @todo: handle help and version inside terminal?
		parts.push(
			`TODO_GET_BIN ${this.#name} ${hasOption ? "[options]" : ""}`
		);

		parts.push("\nDescription:");
		parts.push(description);

		if (hasOption) {
			parts.push("\nOptions:");

			for (const key of optionKeys) {
				parts.push(`  ${key.padEnd(10, " ")} ${options[key]}`);
			}
		}

		console.log(parts.reduce((message, part) => `${message}${part}\n`, ""));
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

const RESERVED_OPTIONS = ["help", "version"] as const;
