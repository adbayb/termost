import type {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	ObjectLikeConstraint,
	ProgramMetadata,
} from "../../types";
import type { CommandController } from "../command";

export const createOption = (
	commandController: CommandController,
	{ argv }: ProgramMetadata,
): CreateInstruction<OptionParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>> => {
	return (parameters) => {
		// oxlint-disable-next-line typescript/no-unsafe-assignment
		const { key, name, description, defaultValue } = parameters;
		const aliases = typeof name === "string" ? [name] : [name.short, name.long];

		const metadataKey = aliases
			.map((alias, index) => {
				return "-".repeat(aliases.length > 1 ? index + 1 : 2) + alias;
			})
			.join(", ");

		commandController.addOptionDescription(metadataKey, description);

		// oxlint-disable-next-line typescript/require-await
		return async function execute() {
			let value: unknown;

			for (const alias of aliases) {
				if (!(alias in argv.options)) {
					continue;
				}

				value = argv.options[alias];

				break;
			}

			return { key, value: value ?? defaultValue };
		};
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
