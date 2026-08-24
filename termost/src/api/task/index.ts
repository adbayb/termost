import { spinner } from "@clack/prompts";
import type {
	ArgumentValues,
	Context,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../../types";

export const createTask: CreateInstruction<
	TaskParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { key, label, handler } = parameters;
	const hasLabel = label !== undefined;

	return async function execute(context, argv) {
		let value: unknown;

		if (hasLabel) {
			const title = typeof label === "function" ? label(context, argv) : label;
			const taskSpinner = spinner();
			const logs: BufferedLog[] = [];
			const originals = overrideConsole(logs);

			try {
				taskSpinner.start(title);
				value = await handler(context, argv);
			} finally {
				restoreConsole(originals);
				taskSpinner.stop(title);
				flushLogs(logs, originals);
			}
		} else {
			value = await handler(context, argv);
		}

		return { key, value };
	};
};

type BufferedLog = {
	args: unknown[];
	method: ConsoleMethod;
};

type ConsoleMethod = "debug" | "error" | "info" | "log" | "warn";

type OriginalConsole = Record<ConsoleMethod, (...args: unknown[]) => void>;

const overrideConsole = (logs: BufferedLog[]) => {
	const originals: OriginalConsole = {
		debug: console.debug,
		error: console.error,
		info: console.info,
		log: console.log,
		warn: console.warn,
	};

	console.debug = (...args: unknown[]) => {
		logs.push({ args, method: "debug" });
	};

	console.error = (...args: unknown[]) => {
		logs.push({ args, method: "error" });
	};

	console.info = (...args: unknown[]) => {
		logs.push({ args, method: "info" });
	};

	console.log = (...args: unknown[]) => {
		logs.push({ args, method: "log" });
	};

	console.warn = (...args: unknown[]) => {
		logs.push({ args, method: "warn" });
	};

	return originals;
};

const restoreConsole = (originals: OriginalConsole) => {
	console.debug = originals.debug;
	console.error = originals.error;
	console.info = originals.info;
	console.log = originals.log;
	console.warn = originals.warn;
};

const flushLogs = (logs: BufferedLog[], originals: OriginalConsole) => {
	for (const { args, method } of logs) {
		originals[method](...args);
	}
};

export type TaskParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values | undefined = undefined,
> = InstructionParameters<
	Values,
	{
		label?: Label<Values>;
		handler: (
			context: Context<Values>,
			argv: ArgumentValues,
		) => Key extends keyof Values ? Promise<Values[Key]> | Values[Key] : Promise<void> | void;
	} & Partial<InstructionKey<Key>>
>;
