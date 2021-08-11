import { globalContext } from "../../context";
import { CommandContext, Instruction, InstructionParameters } from "../types";

export const createOption = (
	parameters: InternalOptionParameters
): Instruction => {
	const { name, defaultValue, description, context } = parameters;
	const aliases = typeof name === "string" ? [name] : name;

	context.metadata.options[aliases.join(", ")] = description;

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
	context: CommandContext;
};

export type OptionParameters = InstructionParameters<{
	name: string | Array<string>;
	description: string;
	defaultValue?: string | number | boolean;
}>;
