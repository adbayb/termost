import {
	ArgumentValues,
	Context,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	ObjectLikeConstraint,
} from "../../types";

export const createOutput: CreateInstruction<
	OutputParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { handler, key } = parameters;

	return async function execute(context, argv) {
		const value = await handler(context, argv);

		return { key, value };
	};
};

export type OutputParameters<
	Values extends ObjectLikeConstraint,
	Key
> = InstructionParameters<
	Values,
	Key extends keyof Values
		? Partial<InstructionKey<Key>> & {
				handler: (
					context: Context<Values>,
					argv: ArgumentValues
				) => Promise<Values[Key]> | Values[Key];
		  }
		: {
				handler: (
					context: Context<Values>,
					argv: ArgumentValues
				) => void;
		  }
>;
