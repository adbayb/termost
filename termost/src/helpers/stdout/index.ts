import chalk from "chalk";

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
		modifier,
	}: {
		color?: Color;
		modifier?: Modifier | Modifier[];
	} = {},
): string => {
	let transformer: chalk.Chalk = chalk;

	if (color) {
		transformer = transformer[chalkByFormatColor[color]];
	}

	if (modifier) {
		const processOneModifier = (mod: Modifier) => {
			if (mod === "uppercase") {
				message = message.toUpperCase();
			} else if (mod === "lowercase") {
				message = message.toLowerCase();
			} else {
				transformer = transformer[chalkByModifier[mod]];
			}
		};

		if (Array.isArray(modifier)) {
			for (const mod of modifier) {
				processOneModifier(mod);
			}
		} else {
			processOneModifier(modifier);
		}
	}

	return transformer(message);
};

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
	}: { type?: MessageType; label?: string } = {},
) => {
	const { color, defaultLabel, icon, method } = formatPropertiesByType[type];
	const messages = typeof content === "string" ? [content] : content;

	method(
		format(`\n${icon} ${label ?? defaultLabel}`, {
			color,
			modifier: "bold",
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

const chalkByFormatColor = {
	red: "redBright",
	green: "greenBright",
	yellow: "yellowBright",
	blue: "blueBright",
	magenta: "magentaBright",
	cyan: "cyanBright",
	grey: "blackBright",
	black: "black",
	white: "white",
} as const;

const chalkByModifier = {
	bold: "bold",
	italic: "italic",
	underline: "underline",
	strikethrough: "strikethrough",
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
