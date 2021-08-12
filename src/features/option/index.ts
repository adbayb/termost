import { CommandContext, Instruction, InstructionParameters } from "../types";

export const createOption = (
	parameters: InternalOptionParameters
): Instruction => {
	const {
		key: keyParameter,
		name,
		defaultValue,
		description,
		commandContext,
	} = parameters;
	const aliases = typeof name === "string" ? [name] : [name.long, name.short];
	const key =
		keyParameter ||
		// @note: we exclude reserved option name from the commandContext output:
		(!["help", "version", undefined].includes(aliases[0])
			? aliases[0]
			: undefined);
	const metadataKey = aliases
		.map((alias, index) => "-".repeat(2 - index) + alias)
		.join(", ");

	commandContext.metadata.options[metadataKey] = description;

	return async function execute(_, programContext) {
		let value: unknown;

		for (const alias of aliases) {
			if (alias in programContext.options) {
				value = programContext.options[alias];

				break;
			}
		}

		return { key, value: value ?? defaultValue };
	};
};

type InternalOptionParameters = OptionParameters & {
	commandContext: CommandContext;
};

export type OptionParameters = InstructionParameters<{
	name: string | { long: string; short: string };
	description: string;
	defaultValue?: string | number | boolean;
}>;
