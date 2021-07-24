import Listr from "listr";
import { Handler, HandlerParameters } from "./types";

export class TaskHandler implements Handler {
	#manager = new Listr();

	constructor(private properties: TaskHandlerParameters) {}

	async execute() {
		const { key, label, handler } = this.properties;
		let value: unknown;

		this.#manager.add({
			title: label,
			task: async () => (value = await handler()),
		});

		await this.#manager.run(); /*.catch((err) => {
			console.error(err);
		});*/

		return { key, value };
	}
}

export type TaskHandlerParameters = HandlerParameters<{
	label: string;
	handler: () => Promise<unknown>;
}>;
