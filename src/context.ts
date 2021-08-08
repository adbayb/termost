export type Context = {
	commandRegistry: Array<{ name: string; description: string }>;
	currentCommand?: string;
	operands: Array<string>; // @todo: expose only operands in context arg for task api?
	options: Record<string, boolean | number | string>;
};

export const DEFAULT_COMMAND_KEY = "program";

// @todo: event emitter to manage global context and event dispatch
export const globalContext: Context = {
	commandRegistry: [],
	operands: [],
	options: {},
};
