import {
	CommandContext,
	ContextValues,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
} from "../types";

export const createOption: CreateInstruction<InternalOptionParameters> = (
	parameters
) => {
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

export type InternalOptionParameters = OptionParameters<
	ContextValues,
	keyof ContextValues
> & {
	commandContext: CommandContext;
};

export type OptionParameters<Values, Key> = InstructionParameters<
	Values,
	Key extends keyof Values
		? InstructionKey<Key> &
				CommonParameters & {
					defaultValue?: Values[Key];
				}
		: CommonParameters
>;

type CommonParameters = {
	name: string | { long: string; short: string };
	description: string;
};
