export type Context = {
	commandName?: string;
	flags?: Record<string, boolean | string>;
};

// @todo: event emitter to manage global context and event dispatch
export const globalContext: Context = {};
