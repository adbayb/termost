export type CommandName = symbol | string;

export type CommandContextValues = Record<string, any>;

export type CommandContext = {
	values: CommandContextValues;
	metadata: {
		description: string;
		options: Record<string, string>;
	};
};

export type ProgramContext = {
	name: string;
	version: string;
	commandRegistry: Array<{
		name: Exclude<CommandName, symbol>;
		description: string;
	}>;
	currentCommand?: CommandName;
	operands: Array<string>;
	options: Record<string, string | boolean | number>;
};

export type InstructionParameters<
	// eslint-disable-next-line @typescript-eslint/ban-types
	ExtraParameters extends Record<string, unknown> = {}
> = {
	/**
	 * Makes the method output available in the context object.
	 * By default, if no provided key, the output is not included in the context.
	 */
	key?: string;
	skip?: (values: CommandContextValues) => boolean;
} & ExtraParameters;

/**
 * Follows the command design pattern
 */
export type Instruction<Value = CommandContextValues[number]> = (
	commandContext: CommandContext,
	programContext: ProgramContext
) => Promise<null | (Pick<InstructionParameters, "key"> & { value: Value })>;

export type CreateInstruction<Parameters extends InstructionParameters> = (
	parameters: Parameters
) => Instruction;
