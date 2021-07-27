import Listr from "listr";
import { ContextValues, Executor, ExecutorInput } from "./types";

export class TaskHandler implements Executor {
	#receiver = new Listr();

	constructor(private properties: InternalTaskExecutorInput) {}

	async execute() {
		const { key, label, handler } = this.properties;
		let value: unknown;

		this.#receiver.add({
			title: label,
			task: async () => (value = await handler()),
		});

		await this.#receiver.run();

		return { key, value };
	}
}

type InternalTaskExecutorInput = Omit<TaskExecutorInput, "handler"> & {
	handler: () => ReturnType<TaskExecutorInput["handler"]>;
};

export type TaskExecutorInput = ExecutorInput<{
	label: string;
	handler: (context: ContextValues) => Promise<unknown>;
}>;
