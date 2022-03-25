export type CommandName = string;

export type ObjectLikeConstraint = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyObject = {};

export type Metadata = {
	name: CommandName;
	version: string;
	/**
	 * args object stores all arguments input by the CLI consumer
	 */
	args: {
		command: CommandName;
		options: Record<string, string | boolean | number>;
	};
	description: string;
};

export type Context<Values extends ObjectLikeConstraint> = {
	command: CommandName;
	values: Values;
};

export type InstructionParameters<
	Values extends ObjectLikeConstraint,
	ExtraParameters extends ObjectLikeConstraint = EmptyObject
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
	Parameters extends InstructionParameters<ObjectLikeConstraint>
> = (parameters: Parameters) => Instruction;

type Instruction = (context: Context<ObjectLikeConstraint>) => Promise<
	| null
	| (Partial<InstructionKey<keyof ObjectLikeConstraint | undefined>> & {
			value: ObjectLikeConstraint[number];
	  })
>;

export type Label<Values extends ObjectLikeConstraint> =
	| string
	| ((context: Context<Values>) => string);
