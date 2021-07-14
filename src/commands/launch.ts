import { Command, CommandParameters } from "./types";

export class LaunchCommand implements Command {
	constructor(
		private properties: CommandParameters<{
			handler: () => ReturnType<Command["execute"]>;
		}>
	) {}

	async execute() {
		const { key, value } = await this.properties.handler();

		return { key, value };
	}
}
