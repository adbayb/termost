export interface Handler {
	execute(): Promise<{ key: string; value: unknown }>;
}

export type HandlerParameters<
	ExtraParameters extends Record<string, unknown>
> = {
	key: string;
} & ExtraParameters;

export type GetCommandParameters<T> = T extends new (
	parameter: infer Param
) => Handler
	? Param
	: never;
