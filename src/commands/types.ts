export interface Command {
	execute(): Promise<{ key: string; value: unknown }>;
}

export type CommandParameters<
	ExtraParameters extends Record<string, unknown>
> = {
	key: string;
} & ExtraParameters;

export type GetCommandParameters<T> = T extends new (
	parameter: infer Param
) => Command
	? Param
	: never;
