import { globalContext } from "../../../context";
import { CommandMetadata } from "../types";
import { Executor, ExecutorInput } from "./types";

// @todo: transform class interface to function one (returning execute function)?
export class OptionHandler implements Executor {
	constructor(private properties: InternalOptionExecutorInput) {
		const { key, description, metadata } = this.properties;

		metadata.options[key] = description;
	}

	async execute() {
		const { key, defaultValue } = this.properties;
		const contextValue = globalContext.options[key];

		return {
			key,
			value: contextValue ?? defaultValue,
		};
	}
}

type InternalOptionExecutorInput = OptionExecutorInput & {
	metadata: CommandMetadata;
};

export type OptionExecutorInput = ExecutorInput<{
	description: string;
	defaultValue?: string | number | boolean;
}>;
