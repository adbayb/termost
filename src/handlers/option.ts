import { globalContext } from "../context";
import { Handler, HandlerParameters } from "./types";

export class OptionHandler implements Handler {
	constructor(private properties: OptionHandlerParameters) {}

	async execute() {
		const { key, description, defaultValue } = this.properties;
		const contextValue = globalContext.options[key];

		return {
			key,
			value: contextValue ?? defaultValue,
		};
	}
}

export type OptionHandlerParameters = HandlerParameters<{
	description: string;
	defaultValue?: string | number | boolean;
}>;
