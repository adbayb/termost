import {
	ArgumentValues,
	Context,
	CreateInstruction,
	InstructionParameters,
	ObjectLikeConstraint,
} from "../../types";

export const createOutput: CreateInstruction<
	OutputParameters<ObjectLikeConstraint>
> = (parameters) => {
	const { handler } = parameters;

	return async function execute(context, argv) {
		handler(context, argv);

		return null;
	};
};

export type OutputParameters<Values extends ObjectLikeConstraint> =
	InstructionParameters<
		Values,
		{
			handler: (context: Context<Values>, argv: ArgumentValues) => void;
		}
	>;
