import { getPackageMetadata } from "./helpers/package";
import { parseArguments } from "./helpers/parser";
import { createProgram } from "./api/program";
import { EmptyObject, ObjectLikeConstraint } from "./types";

export function termost<Values extends ObjectLikeConstraint = EmptyObject>(
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

	setGracefulListeners(callbacks);

	return createProgram<Values>({
		userInputs: { command, options },
		description,
		name,
		version,
	});
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
