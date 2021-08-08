import { Dictionary } from "../../../core/dictionary";

/**
 * Follows the command design pattern
 */
export interface Executor {
	execute(): Promise<{ key?: string; value: unknown }>;
}

export type ContextValues = ReturnType<Dictionary["values"]>;

export type ExecutorInput<
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
