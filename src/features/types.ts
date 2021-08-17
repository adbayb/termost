export type CommandName = symbol | string;

export type ContextValues = Record<string | number | symbol, any>;

export type CommandContext = {
	values: ContextValues;
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
	Values,
	// eslint-disable-next-line @typescript-eslint/ban-types
	ExtraParameters extends Record<string, unknown> = {}
> = {
	skip?: (values: Values) => boolean;
} & ExtraParameters;

export type InstructionKey<Key> = {
	/**
	 * Makes the method output available in the context object.
	 * By default, if no provided key, the output is not included in the context.
	 */
	key: Key;
};

/**
 * Follows the command design pattern
 */
export type CreateInstruction<
	Parameters extends InstructionParameters<ContextValues>
> = (parameters: Parameters) => (
	commandContext: CommandContext,
	programContext: ProgramContext
) => Promise<
	| null
	| (Partial<InstructionKey<keyof ContextValues | undefined>> & {
			value: ContextValues[number];
	  })
>;

export type Label<Values> = string | ((values: Values) => string);
