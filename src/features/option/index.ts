import { globalContext } from "../../context";
import { Instruction, InstructionParameters } from "../types";

export const createOption = (parameters: OptionParameters): Instruction => {
	const { name, defaultValue } = parameters;

	return async function execute() {
		const contextValue = globalContext.options[name];

		return contextValue ?? defaultValue;
	};
};

export type OptionParameters = InstructionParameters<{
	name: string;
	description: string;
	defaultValue?: string | number | boolean;
}>;
