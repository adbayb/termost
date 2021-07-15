import { Command, CommandParameters } from "./types";

export class TaskCommand implements Command {
	constructor(private properties: TaskCommandParameters) {}

	async execute() {
		const { key, value } = await this.properties.handler();

		return { key, value };
	}
}

export type TaskCommandParameters = CommandParameters<{
	handler: () => ReturnType<Command["execute"]>;
}>;
