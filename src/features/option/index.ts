import { globalContext } from "../../context";
import { CommandContext, Instruction, InstructionParameters } from "../types";

export const createOption = (
	parameters: InternalOptionParameters
): Instruction => {
	const {
		key: keyParameter,
		name,
		defaultValue,
		description,
		context,
	} = parameters;
	const aliases = typeof name === "string" ? [name] : [name.long, name.short];
	const key =
		keyParameter ||
		// @note: we exclude reserved option name from the context output:
		(!["help", "version", undefined].includes(aliases[0])
			? aliases[0]
			: undefined);
	const metadataKey = aliases
		.map((alias, index) => "-".repeat(2 - index) + alias)
		.join(", ");

	context.metadata.options[metadataKey] = description;

	return async function execute() {
		let value: unknown;

		for (const alias of aliases) {
			if (alias in globalContext.options) {
				value = globalContext.options[alias];

				break;
			}
		}

		return { key, value: value ?? defaultValue };
	};
};

type InternalOptionParameters = OptionParameters & {
	context: CommandContext;
};

export type OptionParameters = InstructionParameters<{
	name: string | { long: string; short: string };
	description: string;
	defaultValue?: string | number | boolean;
}>;
