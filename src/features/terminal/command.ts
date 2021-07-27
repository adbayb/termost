import { globalContext } from "../../context";
import { TaskManager } from "../../core/taskManager";
import { Dictionary } from "../../core/dictionary";
import { OptionExecutorInput, OptionHandler } from "./executors/option";
import { QuestionExecutorInput, QuestionHandler } from "./executors/question";
import { TaskExecutorInput, TaskHandler } from "./executors/task";
import { Executor, ExecutorInput } from "./executors/types";

export class Command {
	#name: string | undefined;
	#manager: TaskManager;
	#data: Dictionary;

	constructor(name?: string) {
		this.#name = name;
		this.#data = new Dictionary();
		this.#manager = new TaskManager();
	}

	option(params: OptionExecutorInput) {
		this.#manager.register(
			this.#createTask(new OptionHandler(params), params.skip)
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

	#createTask(executor: Executor, skip: ExecutorInput["skip"]) {
		return async () => {
			if (skip?.(this.#data.values())) {
				return;
			}

			const { key, value } = await executor.execute();

			this.#data.set(key, value);
		};
	}

	run() {
		if (this.#name !== undefined && globalContext.command !== this.#name) {
			// @note: named command are run only if it matches the current command name
			return;
		}

		const run = async () => {
			await this.#manager.start();

			console.info("Data = ", this.#data.values());
			console.info(
				"Global context = ",
				JSON.stringify(globalContext, null, 4)
			);
		};

		run();

		const stop = () => this.#manager.stop();

		return function cleanup() {
			stop();
		};
	}
}
