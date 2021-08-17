import {
	Context,
	CreateInstruction,
	DefaultValues,
	InstructionParameters,
} from "../types";
import { format, print } from "./helpers";

export const createMessage: CreateInstruction<
	MessageParameters<DefaultValues>
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

export type MessageParameters<Values> = InstructionParameters<
	Values,
	{
		handler: (context: Context<Values>, helpers: typeof HELPERS) => void;
	}
>;
