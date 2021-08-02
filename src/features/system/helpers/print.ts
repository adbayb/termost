import chalk from "chalk";

type FormatColor =
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "grey"
	| "black"
	| "white";

type FormatModifier =
	| "bold"
	| "italic"
	| "underline"
	| "strikethrough"
	| "uppercase"
	| "lowercase";

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

type FormatFunction<ReturnValue = string> = (
	message: string,
	options?: {
		color?: FormatColor;
		modifier?: FormatModifier | Array<FormatModifier>;
	}
) => ReturnValue;

export const format: FormatFunction = (message, { color, modifier } = {}) => {
	let transformer: chalk.Chalk = chalk;

	if (color) {
		transformer = transformer[chalkByFormatColor[color]];
	}

	if (modifier) {
		const processOneModifier = (mod: FormatModifier) => {
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

export const print: FormatFunction<void> = (message, options) => {
	console.log(format(message, options));
};

type BannerType = "success" | "error" | "warning" | "information";

const bannerPropertiesByType: Record<
	BannerType,
	{ icon: string; color: FormatColor }
> = {
	error: {
		icon: "❌",
		color: "red",
	},
	information: {
		icon: "ℹ️ ",
		color: "blue",
	},
	success: {
		icon: "✅",
		color: "green",
	},
	warning: {
		icon: "⚠️ ",
		color: "yellow",
	},
};

export const banner = (type: BannerType, message: string) => {
	const { icon, color } = bannerPropertiesByType[type];

	print(`${icon} ${message}`, { color, modifier: "bold" });
};
