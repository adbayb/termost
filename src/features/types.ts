export type CommandName = string;

export type DefaultValues = Record<string, any>;

export type Context<Values> = {
	name: string;
	version: string;
	currentCommand: CommandName;
	commands: Record<CommandName, string>;
	options: Record<string, string | boolean | number>;
	values: Values;
};

export type InstructionParameters<
	Values,
	// eslint-disable-next-line @typescript-eslint/ban-types
	ExtraParameters extends Record<string, unknown> = {}
> = {
	skip?: (context: Context<Values>) => boolean;
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
	Parameters extends InstructionParameters<DefaultValues>
> = (parameters: Parameters) => (context: Context<DefaultValues>) => Promise<
	| null
	| (Partial<InstructionKey<keyof DefaultValues | undefined>> & {
			value: DefaultValues[number];
	  })
>;

export type Label<Values> = string | ((context: Context<Values>) => string);
