import { ContextValues, Instruction, InstructionParameters } from "../types";
import { format, print } from "./helpers";

export const createMessage = (
	parameters: InternalMessageParameters
): Instruction => {
	const { handler } = parameters;

	return async function execute() {
		handler(HELPERS);
	};
};

const HELPERS = {
	format,
	print,
};

type InternalMessageParameters = Omit<MessageParameters, "handler"> & {
	handler: (
		helpers: typeof HELPERS
	) => ReturnType<MessageParameters["handler"]>;
};

export type MessageParameters = Omit<
	InstructionParameters<{
		handler: (helpers: typeof HELPERS, context: ContextValues) => void;
	}>,
	"key"
>;
