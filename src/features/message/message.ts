import {
	ContextValues,
	CreateInstruction,
	InstructionParameters,
} from "../types";
import { format, print } from "./helpers";

export const createMessage: CreateInstruction<
	MessageParameters<ContextValues>
> = (parameters) => {
	const { handler } = parameters;

	return async function execute(commandContext) {
		handler(commandContext.values, HELPERS);

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
		handler: (values: Values, helpers: typeof HELPERS) => void;
	}
>;
