/** Raw CLI arguments parsed from user inputs. */
export type ArgumentValues = {
	command: CommandName;
	operands: string[];
	options: Record<string, boolean | number | string>;
};

export type CommandName = string;
export type Context<Values extends ObjectLikeConstraint> = Values;

/** Follows the command design pattern. */
export type CreateInstruction<Parameters extends InstructionParameters<ObjectLikeConstraint>> = (
	parameters: Parameters,
) => Instruction;

// oxlint-disable-next-line @typescript-eslint/no-empty-object-type
export type EmptyObject = {};

export type InstructionKey<Key> = {
	/**
	 * Makes the method output available in the context object. By default, if no provided key, the
	 * output is not included in the context.
	 */
	key: Key;
};

export type InstructionParameters<
	Values extends ObjectLikeConstraint,
	ExtraParameters extends ObjectLikeConstraint = EmptyObject,
> = {
	skip?: (context: Context<Values>, argv: ArgumentValues) => boolean;
	validate?: (context: Context<Values>, argv: ArgumentValues) => Error | undefined;
} & ExtraParameters;

export type Label<Values extends ObjectLikeConstraint> =
	| ((context: Context<Values>, argv: ArgumentValues) => string)
	| string;

// oxlint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLikeConstraint = Record<string, any>;

export type PackageMetadata = {
	name: string;
	description: string;
	version: string;
};

export type ProgramMetadata = PackageMetadata & {
	argv: ArgumentValues;
	hasInteractiveInstruction: boolean;
	isEmptyCommand: Record<CommandName, boolean>;
};

type Instruction = (
	context: Context<ObjectLikeConstraint>,
	argv: ArgumentValues,
) => Promise<
	| null
	| (Partial<InstructionKey<keyof ObjectLikeConstraint | undefined>> & {
			value: ObjectLikeConstraint[number];
	  })
>;
