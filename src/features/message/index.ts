import {
	Context,
	CreateInstruction,
	InstructionParameters,
	ObjectLikeConstraint,
} from "../types";
import { format, print } from "./helpers";

export const createMessage: CreateInstruction<
	MessageParameters<ObjectLikeConstraint>
> = (parameters) => {
	const { handler } = parameters;

	return async function execute(context) {
		handler(context, HELPERS);

		return null;
	};
};

const HELPERS = {
	format,
	print,
};

export type MessageParameters<Values extends ObjectLikeConstraint> =
	InstructionParameters<
		Values,
		{
			handler: (
				context: Context<Values>,
				helpers: typeof HELPERS
			) => void;
		}
	>;
