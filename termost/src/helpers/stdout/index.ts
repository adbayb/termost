import pico from "picocolors";

/**
 * A helper to format an arbitrary text as a message input.
 * @param message - The text to display.
 * @param options - The configuration object to control the formatting properties.
 * @param options.color - The color to apply.
 * @param options.modifiers - The modifiers to apply (can be italic, bold, ...).
 * @returns The formatted text.
 * @example
 * const formattedMessage = format("my message");
 */
export const format = (
	message: string,
	{
		color,
		modifiers,
	}: {
		color?: Color;
		modifiers?: Modifier[];
	} = {
		color: "white",
		modifiers: [],
	},
) => {
	const transformers: ((input: string) => string)[] = [];

	transformers.push(pico[colorMapper[color ?? "white"]]);

	(modifiers ?? []).forEach((mod: Modifier) => {
		if (mod === "uppercase") {
			message = message.toUpperCase();
		} else if (mod === "lowercase") {
			message = message.toLowerCase();
		} else {
			transformers.push(pico[modifierMapper[mod]]);
		}
	});

	return compose(...transformers)(message);
};

/**
 * An opinionated helper to display arbitrary text on the console.
 * @param content - The content to display. A content can be either a string or an error.
 * @param options - The configuration object to define the display type and/or override the default label.
 * @param options.label - The label to display.
 * @param options.type - The message type.
 * @example
 * message("message to log");
 */
export const message = (
	content: Error | string,
	options?: { label?: string; type?: MessageType },
) => {
	const isTextualContent = typeof content === "string";
	const type = options?.type ?? (isTextualContent ? "information" : "error");
	const { color, defaultLabel, icon, method } = formatPropertiesByType[type];

	method(
		format(`\n${icon} ${options?.label ?? defaultLabel}`, {
			color,
			modifiers: ["bold"],
		}),
	);

	// Do not format error with colors to preserve the stack trace:
	method(isTextualContent ? format(`   ${content}`, { color }) : content);
};

const compose = <T>(...fns: ((a: T) => T)[]) =>
	fns.reduce(
		(prevFn, nextFn) => (value) => prevFn(nextFn(value)),
		fns[0] as (a: T) => T,
	);

const formatPropertiesByType = {
	error: {
		color: "red",
		defaultLabel: "Error",
		icon: "❌",
		method: console.error,
	},
	information: {
		color: "blue",
		defaultLabel: "Information",
		icon: "ℹ️",
		method: console.info,
	},
	success: {
		color: "green",
		defaultLabel: "Success",
		icon: "✅",
		method: console.log,
	},
	warning: {
		color: "yellow",
		defaultLabel: "Warning",
		icon: "⚠️ ",
		method: console.warn,
	},
} as const;

const colorMapper = {
	black: "black",
	blue: "blue",
	cyan: "cyan",
	green: "green",
	grey: "gray",
	magenta: "magenta",
	red: "red",
	white: "white",
	yellow: "yellow",
} as const;

const modifierMapper = {
	bold: "bold",
	italic: "italic",
	strikethrough: "strikethrough",
	underline: "underline",
} as const;

type MessageType = "error" | "information" | "success" | "warning";

type Color =
	| "black"
	| "blue"
	| "cyan"
	| "green"
	| "grey"
	| "magenta"
	| "red"
	| "white"
	| "yellow";

type Modifier =
	| "bold"
	| "italic"
	| "lowercase"
	| "strikethrough"
	| "underline"
	| "uppercase";
