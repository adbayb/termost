import { styleText } from "node:util";
import { log } from "@clack/prompts";

type Logger = Record<LogLevel, (message: string, metadata?: Record<string, unknown>) => void>;

type LogLevel = "debug" | "error" | "info" | "success" | "warn";

/**
 * Creates a logger.
 *
 * @example
 * 	const log = createLogger({ name: "my-cli", level: "info" });
 *
 * 	logger.info("Starting build");
 * 	logger.debug("Debug trace", { cwd: process.cwd() });
 *
 * @param options - Logger configuration.
 * @returns A logger exposing debug, info, success, warn, and error methods.
 */
export const createLogger = (
	options: {
		/** The logger namespace displayed as a prefix for each message. */
		name?: string;
		/**
		 * The minimum log level to display.
		 *
		 * @default "info" - debug output is verbose and reserved for troubleshooting. Users can opt into it by passing `level: "debug"`.
		 */
		level?: LogLevel;
	} = {},
): Logger => {
	const { name, level = "info" } = options;
	const minimumRank = LEVEL_RANK[level];

	const print = (methodLevel: LogLevel, message: string, metadata?: Record<string, unknown>) => {
		if (LEVEL_RANK[methodLevel] < minimumRank) {
			return;
		}

		const prefix = name ? `${styleText("dim", `[${name}]`)} ` : "";
		const output = `${prefix}${message}`;

		LEVEL_LOGGERS[methodLevel](output);

		if (metadata) {
			log.message(JSON.stringify(metadata, undefined, 2));
		}
	};

	return {
		debug(message, metadata) {
			print("debug", message, metadata);
		},
		error(message, metadata) {
			print("error", message, metadata);
		},
		info(message, metadata) {
			print("info", message, metadata);
		},
		success(message, metadata) {
			print("success", message, metadata);
		},
		warn(message, metadata) {
			print("warn", message, metadata);
		},
	};
};

const LEVEL_RANK: Record<LogLevel, number> = {
	debug: 0,
	error: 4,
	info: 1,
	success: 2,
	warn: 3,
};

const LEVEL_LOGGERS: Record<LogLevel, (message: string) => void> = {
	debug: (message) => {
		log.message(message, { symbol: styleText("dim", "◆") });
	},
	error: log.error,
	info: log.info,
	success: log.success,
	warn: log.warn,
};
