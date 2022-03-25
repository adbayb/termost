import { CommandController } from "../command";
import {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	ObjectLikeConstraint,
	ProgramMetadata,
} from "../../types";

export const createOption =
	(
		commandController: CommandController,
		{ argv }: ProgramMetadata
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

		commandController.addOptionDescription(metadataKey, description);

		return async function execute() {
			let value: unknown;

			for (const alias of aliases) {
				if (alias in argv.options) {
					value = argv.options[alias];

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
