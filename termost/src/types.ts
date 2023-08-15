export type CommandName = string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLikeConstraint = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyObject = {};

/**
 * Raw CLI arguments parsed from user inputs
 */
export type ArgumentValues = {
	command: CommandName;
	options: Record<string, string | boolean | number>;
	operands: Array<string>;
};

export type PackageMetadata = {
	name: string;
	version: string;
	description: string;
};

export type ProgramMetadata = PackageMetadata & {
	argv: ArgumentValues;
};

export type Context<Values extends ObjectLikeConstraint> = Values;

export type InstructionParameters<
	Values extends ObjectLikeConstraint,
	ExtraParameters extends ObjectLikeConstraint = EmptyObject,
> = {
	skip?: (context: Context<Values>, argv: ArgumentValues) => boolean;
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
	Parameters extends InstructionParameters<ObjectLikeConstraint>,
> = (parameters: Parameters) => Instruction;

type Instruction = (
	context: Context<ObjectLikeConstraint>,
	argv: ArgumentValues,
) => Promise<
	| null
	| (Partial<InstructionKey<keyof ObjectLikeConstraint | undefined>> & {
			value: ObjectLikeConstraint[number];
	  })
>;

export type Label<Values extends ObjectLikeConstraint> =
	| string
	| ((context: Context<Values>, argv: ArgumentValues) => string);
