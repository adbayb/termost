import { Dictionary } from "../../../core/dictionary";

/**
 * Follows the command design pattern
 */
export interface Executor {
	execute(): Promise<{ key: string; value: unknown }>;
}

export type ContextValues = ReturnType<Dictionary["values"]>;

export type ExecutorInput<
	// eslint-disable-next-line @typescript-eslint/ban-types
	ExtraParameters extends Record<string, unknown> = {}
> = {
	key: string;
	skip?: (context: ContextValues) => boolean;
} & ExtraParameters;
