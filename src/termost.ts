import { getPackageMetadata } from "./helpers/package";
import { getArguments } from "./helpers/stdin";
import {
	CommandName,
	CreateInstruction,
	EmptyObject,
	InstructionParameters,
	ObjectLikeConstraint,
	ProgramMetadata,
} from "./types";
import {
	CommandParameters,
	createCommand,
	getCommandController,
} from "./api/command";
import { MessageParameters, createMessage } from "./api/message";
import { OptionParameters, createOption } from "./api/option";
import { QuestionParameters, createQuestion } from "./api/question";
import { TaskParameters, createTask } from "./api/task";

/**
 * The termost fluent interface API
 */
export type Termost<Values extends ObjectLikeConstraint = EmptyObject> = {
	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command<CommandValues extends ObjectLikeConstraint = EmptyObject>(
		params: CommandParameters
	): Termost<Values & CommandValues>;
	message(params: MessageParameters<Values>): Termost<Values>;
	option<Key>(params: OptionParameters<Values, Key>): Termost<Values>;
	question<Key extends keyof Values>(
		params: QuestionParameters<Values, Key>
	): Termost<Values>;
	task<Key>(params: TaskParameters<Values, Key>): Termost<Values>;
};

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

	const { command = name, options } = getArguments();

	setGracefulListeners(callbacks);

	return createProgram<Values>({
		userInputs: { command, options },
		description,
		name,
		version,
	});
}

export const createProgram = <Values extends ObjectLikeConstraint>(
	metadata: ProgramMetadata
): Termost<Values> => {
	const { name, description } = metadata;
	const rootCommandName: CommandName = name;
	let currentCommandName: CommandName = rootCommandName;

	const createInstruction = <Parameters>(
		createInstruction: CreateInstruction<Parameters>,
		params: InstructionParameters<Values>
	) => {
		const instruction = createInstruction(params as Parameters);
		const controller = getCommandController<Values>(currentCommandName);

		controller.addInstruction(async () => {
			const { skip } = params;
			const context = controller.getContext(rootCommandName);

			if (skip?.(context)) return;

			const output = await instruction(context);

			if (!output || !output.key) return;

			controller.addValue(
				output.key,
				output.value as Values[keyof Values]
			);
		});
	};

	const program: Termost<Values> = {
		command<CommandValues>(params: CommandParameters) {
			currentCommandName = createCommand(params, metadata);

			return this as Termost<CommandValues & Values>;
		},
		message(params) {
			createInstruction(createMessage, params);

			return this;
		},
		option(params) {
			createInstruction(
				createOption(
					getCommandController(currentCommandName),
					metadata
				),
				params
			);

			return this;
		},
		question(params) {
			createInstruction(createQuestion, params);

			return this;
		},
		task(params) {
			createInstruction(createTask, params);

			return this;
		},
	};

	// @note: the root command is created by default
	program.command({
		name,
		description,
	});

	return program;
};

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
