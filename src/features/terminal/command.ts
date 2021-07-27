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
			key: "help",
			description: "Display the help center",
		}).option({
			key: "version",
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

	run() {
		// @note: if the user command doesn't match the the command instance name, then do not execute the command
		if (globalContext.command !== this.#name) {
			return;
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

			return;
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

		const stop = () => this.#manager.stop();

		return function cleanup() {
			stop();
		};
	}

	#help() {
		console.info("TODO: help");
	}

	#version() {
		console.info("TODO: version");
	}

	#createTask(executor: Executor, skip: ExecutorInput["skip"]) {
		return async () => {
			if (skip?.(this.#data.values())) {
				return;
			}

			const { key, value } = await executor.execute();

			this.#data.set(key, value);
		};
	}
}

const RESERVED_OPTIONS = ["help", "version"] as const;
