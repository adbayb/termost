import pico from "picocolors";

/**
 * A helper to format an arbitrary text as a message input
 * @param message The text to display
 * @param options The configuration object to control the formatting properties
 * @returns The formatted text
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

const compose = <T>(...fns: ((a: T) => T)[]) =>
	fns.reduce(
		(prevFn, nextFn) => (value) => prevFn(nextFn(value)),
		fns[0] as (a: T) => T,
	);

/**
 * An opinionated helper to display arbitrary text on the console
 * @param message The text to display. Use an array if you need to display a message in several lines
 * @param options The configuration object to define the display type and/or override the default label
 */
export const message = (
	content: string[] | string,
	{
		label,
		type = "information",
	}: { label?: string; type?: MessageType } = {},
) => {
	const { color, defaultLabel, icon, method } = formatPropertiesByType[type];
	const messages = typeof content === "string" ? [content] : content;

	method(
		format(`\n${icon} ${label ?? defaultLabel}`, {
			color,
			modifiers: ["bold"],
		}),
	);

	for (const msg of messages) {
		method(format(`   ${msg}`, { color }));
	}
};

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
		icon: "ℹ️ ",
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
