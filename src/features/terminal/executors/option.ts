import { globalContext } from "../../../context";
import { Executor, ExecutorInput } from "./types";

export class OptionHandler implements Executor {
	constructor(private properties: OptionExecutorInput) {}

	async execute() {
		const { key, description, defaultValue } = this.properties;
		const contextValue = globalContext.options[key];

		globalContext.metadata[globalContext.command]!.options[key] =
			description;

		return {
			key,
			value: contextValue ?? defaultValue,
		};
	}
}

export type OptionExecutorInput = ExecutorInput<{
	description: string;
	defaultValue?: string | number | boolean;
}>;
