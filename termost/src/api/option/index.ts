/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CommandController } from "../command";
import type {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	ObjectLikeConstraint,
	ProgramMetadata,
} from "../../types";

export const createOption =
	(
		commandController: CommandController,
		{ argv }: ProgramMetadata,
	): CreateInstruction<
		OptionParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
	> =>
	(parameters) => {
		const { key, name, description, defaultValue } = parameters;

		const aliases =
			typeof name === "string" ? [name] : [name.short, name.long];

		const metadataKey = aliases
			.map(
				(alias, index) =>
					"-".repeat(aliases.length > 1 ? index + 1 : 2) + alias,
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

			return Promise.resolve({ key, value: value ?? defaultValue });
		};
	};

export type OptionParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values,
> = InstructionParameters<
	Values,
	InstructionKey<Key> & {
		name: string | { long: string; short: string };
		description: string;
		defaultValue?: Values[Key];
	}
>;
