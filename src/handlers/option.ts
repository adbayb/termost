import { Handler, HandlerParameters } from "./types";

export class OptionHandler implements Handler {
	constructor(private properties: OptionHandlerParameters) {}

	async execute() {
		const { key, description, defaultValue, type } = this.properties;

		if (type === "flag") {
			// args.option(key, description, defaultValue);
			// const flags = args.parse(process.argv);
			// return { key, value: flags[key] };
		}

		// @todo: arg management
		return { key, value: undefined };
	}
}

export type OptionHandlerParameters = HandlerParameters<{
	type: "argument" | "flag";
	description: string;
	defaultValue?: string | number | boolean;
}>;
