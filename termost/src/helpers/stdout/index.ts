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
 * @param options.linebreak - Configure line break addition.
 * @param options.linebreak.start - Configure line break addition in a start trailing position (by default, true).
 * @param options.linebreak.end - Configure line break addition in an end trailing position (by default, false).
 * @example
 * message("message to log");
 */
export const message = (
	content: Error | string,
	{
		label: optionLabel,
		linebreak: optionLinebreak,
		type: optionType,
	}: {
		label?: string | false;
		linebreak?: { end: boolean; start: boolean };
		type?: MessageType;
	} = {},
) => {
	const isTextualContent = typeof content === "string";
	const type = optionType ?? (isTextualContent ? "information" : "error");
	const { color, defaultLabel, icon, method } = formatPropertiesByType[type];
	const linebreakStart = optionLinebreak?.start ?? true;
	const linebreakEnd = optionLinebreak?.end ?? false;

	const getLabel = () => {
		if (optionLabel === false) {
			return content instanceof Error ? content.message : content;
		}

		return optionLabel ?? defaultLabel;
	};

	method(
		format(
			`${linebreakStart ? "\n" : ""}${icon} ${getLabel()}${linebreakEnd ? "\n" : ""}`,
			{
				color,
				modifiers: ["bold"],
			},
		),
	);

	// Do not format error with colors to preserve the stack trace:
	method(isTextualContent ? format(`   ${content}`, { color }) : content);
};

const compose = <T>(...fns: ((a: T) => T)[]) => {
	if (!fns[0])
		throw new Error(
			"No function is provided, defeating the purpose of composing functions. Make sure to provide at least one function as an argument.",
		);

	return fns.reduce<(a: T) => T>(
		(prevFn, nextFn) => (value) => prevFn(nextFn(value)),
		fns[0],
	);
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
