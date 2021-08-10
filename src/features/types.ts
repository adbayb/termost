import { Dictionary } from "../core/dictionary";

export type InstructionParameters<
	// eslint-disable-next-line @typescript-eslint/ban-types
	ExtraParameters extends Record<string, unknown> = {}
> = {
	/**
	 * Makes the method output available in the context object.
	 * By default, if no provided key, the output is not included in the context.
	 */
	key?: string;
	skip?: (context: ContextValues) => boolean;
} & ExtraParameters;

/**
 * Follows the command design pattern
 */
export type Instruction<Value = unknown> = () => Promise<Value>;

export type CreateInstruction<Parameters extends InstructionParameters> = (
	parameters: Parameters
) => Instruction<unknown>;

export type ContextValues = ReturnType<Dictionary["values"]>;
