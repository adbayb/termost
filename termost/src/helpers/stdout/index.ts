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
	options: {
		color?: Color;
		modifiers?: Modifier[];
	} = {},
) => {
	const { color = "white", modifiers = [] } = options;
	const transformers: ((input: string) => string)[] = [];

	transformers.push(pico[colorMapper[color]]);

	modifiers.forEach((modifier: Modifier) => {
		if (modifier === "uppercase") {
			message = message.toUpperCase();
		} else if (modifier === "lowercase") {
			message = message.toLowerCase();
		} else {
			transformers.push(pico[modifierMapper[modifier]]);
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
 * @param options.lineBreak - Configure line break addition.
 * @example
 * message("message to log");
 */
export const message = (
	content: Error | string,
	{
		label: optionLabel,
		lineBreak: optionlineBreak,
		type: optionType,
	}: {
		label?: string | false;
		lineBreak?: LineBreakByPosition | boolean;
		type?: MessageType;
	} = {},
) => {
	const isTextualContent = typeof content === "string";
	const type = optionType ?? (isTextualContent ? "information" : "error");
	const { color, defaultLabel, icon, method } = formatPropertiesByType[type];
	const hasNoLabel = optionLabel === false;

	const getLineBreak = (): LineBreakByPosition => {
		if (optionlineBreak === undefined) {
			return {
				end: false,
				start: false,
			};
		}

		if (isRecord(optionlineBreak)) {
			return optionlineBreak;
		}

		return {
			end: optionlineBreak,
			start: optionlineBreak,
		};
	};

	const getLabel = () => {
		if (hasNoLabel) {
			return isTextualContent ? content : content.message;
		}

		return optionLabel ?? defaultLabel;
	};

	const lineBreak = getLineBreak();

	const output = [
		format(`${lineBreak.start ? "\n" : ""}${icon} ${getLabel()}`, {
			color,
			modifiers: ["bold"],
		}),
		!hasNoLabel && isTextualContent
			? format(`   ${content}`, { color })
			: undefined,
		!isTextualContent
			? // Do not format error with colors to preserve the stack trace:
				content
			: undefined,
	].filter(Boolean);

	output.forEach((item) => {
		method(item);
	});

	if (lineBreak.end) {
		method();
	}
};

type LineBreakByPosition = { end: boolean; start: boolean };

const isRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

const compose = <T>(...functions: ((a: T) => T)[]) => {
	if (!functions[0])
		throw new Error(
			"No function is provided, defeating the purpose of composing functions. Make sure to provide at least one function as an argument.",
		);

	return functions.reduce<(a: T) => T>(
		(previousFunction, nextFunction) => (value) =>
			previousFunction(nextFunction(value)),
		functions[0],
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
