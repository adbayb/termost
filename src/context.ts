export type Context = {
	command?: string;
	operands: Array<string>; // @todo: expose only operands in context arg for task api?
	options: Record<string, boolean | number | string>;
};

// @todo: event emitter to manage global context and event dispatch
export const globalContext: Context = {
	operands: [],
	options: {},
};