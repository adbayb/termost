import { globalContext } from "../../context";
import { Instruction, InstructionParameters, Metadata } from "../types";

export const createOption = (
	parameters: InternalOptionParameters
): Instruction => {
	const { name, defaultValue, description, metadata } = parameters;
	const aliases = typeof name === "string" ? [name] : name;

	metadata.options[aliases.join(", ")] = description;

	return async function execute() {
		let value: unknown;

		for (const alias of aliases) {
			if (alias in globalContext.options) {
				value = globalContext.options[alias];

				break;
			}
		}

		return value ?? defaultValue;
	};
};

type InternalOptionParameters = OptionParameters & {
	metadata: Metadata;
};

export type OptionParameters = InstructionParameters<{
	name: string | Array<string>;
	description: string;
	defaultValue?: string | number | boolean;
}>;
