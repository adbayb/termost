import {
	CommandContextValues,
	Instruction,
	InstructionParameters,
} from "../types";
import { format, print } from "./helpers";

export const createMessage = (parameters: MessageParameters): Instruction => {
	const { handler } = parameters;

	return async function execute(context) {
		handler(context.values, HELPERS);

		return null;
	};
};

const HELPERS = {
	format,
	print,
};

export type MessageParameters = Omit<
	InstructionParameters<{
		handler: (
			values: CommandContextValues,
			helpers: typeof HELPERS
		) => void;
	}>,
	"key"
>;
