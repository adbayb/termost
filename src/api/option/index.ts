import {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Metadata,
	ObjectLikeConstraint,
} from "../../types";

export const createOption =
	(
		metadata: Metadata
	): CreateInstruction<
		OptionParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
	> =>
	(parameters) => {
		const { key, name, defaultValue, description } = parameters;
		const aliases =
			typeof name === "string" ? [name] : [name.short, name.long];
		const metadataKey = aliases
			.map(
				(alias, index) =>
					"-".repeat(aliases.length > 1 ? index + 1 : 2) + alias
			)
			.join(", ");

		metadata.options[metadataKey] = description;

		return async function execute() {
			let value: unknown;

			for (const alias of aliases) {
				if (alias in metadata.args.options) {
					value = metadata.args.options[alias];

					break;
				}
			}

			return { key, value: value ?? defaultValue };
		};
	};

export type OptionParameters<
	Values extends ObjectLikeConstraint,
	Key
> = InstructionParameters<
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
