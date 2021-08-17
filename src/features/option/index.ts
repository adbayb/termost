import {
	Context,
	CreateInstruction,
	DefaultValues,
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
		context,
	} = parameters;
	const aliases = typeof name === "string" ? [name] : [name.short, name.long];
	const key =
		keyParameter ||
		// @note: we exclude reserved option name from the commandContext output:
		(!["help", "version", undefined].includes(aliases[0])
			? aliases[0]
			: undefined);
	const metadataKey = aliases
		.map(
			(alias, index) =>
				"-".repeat(aliases.length > 1 ? index + 1 : 2) + alias
		)
		.join(", ");

	context.options[metadataKey] = description;

	return async function execute(context) {
		let value: unknown;

		for (const alias of aliases) {
			if (alias in context.args.options) {
				value = context.args.options[alias];

				break;
			}
		}

		return { key, value: value ?? defaultValue };
	};
};

export type InternalOptionParameters = OptionParameters<
	DefaultValues,
	keyof DefaultValues
> & {
	context: Context<DefaultValues>;
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
