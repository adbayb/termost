import { DEFAULT_COMMAND_NAME } from "./constants";
import { getPackageMetadata } from "./core/package";
import { parseArguments } from "./core/parser";
import { Command } from "./features/command";
import { Context, EmptyContext, ObjectLikeConstraint } from "./features/types";

export function termost<Values extends ObjectLikeConstraint = EmptyContext>(
	metadata:
		| string
		| {
				name: string;
				description: string;
				version: string;
		  },
	callbacks: TerminationCallbacks = {}
): Termost<Values> {
	let description: string;
	let name: string;
	let version: string;
	const { command = DEFAULT_COMMAND_NAME, options } = parseArguments();

	if (isObject(metadata)) {
		description = metadata.description;
		name = metadata.name;
		version = metadata.version;
	} else {
		const packageMetadata = getPackageMetadata();

		description = metadata;
		name = packageMetadata.name;
		version = packageMetadata.version;
	}

	const context: Context<Values> = {
		args: { command, options },
		commands: {},
		name,
		options: {},
		values: {} as Values,
		version,
	};

	setGracefulListeners(callbacks);

	return new Termost<Values>(description, context);
}

export class Termost<
	Values extends ObjectLikeConstraint = EmptyContext
> extends Command<Values> {
	constructor(description: string, context: Context<Values>) {
		super(DEFAULT_COMMAND_NAME, description, context);
	}

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command<CommandValues extends ObjectLikeConstraint = EmptyContext>(params: {
		name: string;
		description: string;
	}) {
		return new Command<Values & CommandValues>(
			params.name,
			params.description,
			this.context as Context<Values & CommandValues>
		);
	}
}

const isObject = (value: unknown): value is ObjectLikeConstraint => {
	return value !== null && typeof value === "object";
};

type TerminationCallbacks = Partial<{
	onShutdown: () => void;
	onException: (error: Error) => void;
}>;

const setGracefulListeners = ({
	onShutdown = () => {},
	onException = () => {},
}: TerminationCallbacks) => {
	// @section: gracefully shutdown our cli:
	process.on("SIGTERM", () => {
		onShutdown();
		process.exit(0);
	});

	process.on("SIGINT", () => {
		onShutdown();
		process.exit(0);
	});

	process.on("uncaughtException", (error) => {
		onException(error);
		process.exit(1);
	});

	process.on("unhandledRejection", (reason) => {
		if (reason instanceof Error) {
			onException(reason);
		}

		process.exit(1);
	});
};
