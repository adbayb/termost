import { Plugin, PluginCommonProperties } from "./types";

export class CommandPlugin implements Plugin {
	constructor(public properties: CommandPluginParameters) {}

	key() {
		return this.properties.key
	}

	async execute() {
		return this.properties.handler();
	}
}

type CommandPluginParameters = PluginCommonProperties & {
	handler: () => 
}
