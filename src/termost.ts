import { getPackageMetadata } from "./helpers/package";
import { parseArguments } from "./helpers/parser";
import { createProgram } from "./features/program";
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
) {
	let description: string;
	let name: string;
	let version: string;

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

	const { command = name, options } = parseArguments();

	const context: Context<Values> = {
		args: { command, options },
		commands: {},
		description,
		name,
		options: {},
		values: {} as Values,
		version,
	};

	setGracefulListeners(callbacks);

	return createProgram(context);
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
