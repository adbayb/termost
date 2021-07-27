export type Context = {
	command: string;
	operands: Array<string>; // @todo: expose only operands in context arg for task api?
	options: Record<string, boolean | number | string>;
	metadata: {
		[command: string]: {
			description: string;
			options: Record<string, string>;
		};
	};
};

export const DEFAULT_COMMAND_KEY = "program";

// @todo: event emitter to manage global context and event dispatch
export const globalContext: Context = {
	command: DEFAULT_COMMAND_KEY,
	operands: [],
	options: {},
	metadata: {},
};
