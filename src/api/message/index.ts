import {
	Context,
	CreateInstruction,
	InstructionParameters,
	ObjectLikeConstraint,
} from "../../types";

export const createMessage: CreateInstruction<
	MessageParameters<ObjectLikeConstraint>
> = (parameters) => {
	const { handler } = parameters;

	return async function execute(context) {
		handler(context);

		return null;
	};
};

export type MessageParameters<Values extends ObjectLikeConstraint> =
	InstructionParameters<
		Values,
		{
			handler: (context: Context<Values>) => void;
		}
	>;
