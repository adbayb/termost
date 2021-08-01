import { globalContext } from "../../../context";
import { CommandMetadata } from "../types";
import { Executor, ExecutorInput } from "./types";

// @todo: transform class interface to function one (returning execute function)?
export class OptionHandler implements Executor {
	constructor(private properties: InternalOptionExecutorInput) {
		const { name, description, metadata } = this.properties;

		metadata.options[name] = description;
	}

	async execute() {
		const { name, defaultValue } = this.properties;
		const contextValue = globalContext.options[name];

		return {
			name,
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
