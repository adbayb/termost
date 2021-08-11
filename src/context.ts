export type Context = {
	commandRegistry: Array<{ name: string; description: string }>;
	currentCommand?: string;
	operands: Array<string>;
	options: Record<string, boolean | number | string>;
};

export const DEFAULT_COMMAND_KEY = "program";

// @todo: refacto global context
export const globalContext: Context = {
	commandRegistry: [],
	operands: [],
	options: {},
};
