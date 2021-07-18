import { Handler, HandlerParameters } from "./types";

export class TaskHandler implements Handler {
	constructor(private properties: TaskHandlerParameters) {}

	async execute() {
		const { key, value } = await this.properties.handler();

		return { key, value };
	}
}

export type TaskHandlerParameters = HandlerParameters<{
	label: string;
	handler: () => ReturnType<Handler["execute"]>;
}>;
