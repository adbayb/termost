import { createCommand, getCommandController } from "./api/command";
import type { CommandParameters } from "./api/command";
import { createInput } from "./api/input";
import type { InputParameters } from "./api/input";
import { createOption } from "./api/option";
import type { OptionParameters } from "./api/option";
import { createTask } from "./api/task";
import type { TaskParameters } from "./api/task";
import { getPackageMetadata } from "./helpers/package";
import { getArguments } from "./helpers/stdin";
import type {
	CommandName,
	CreateInstruction,
	EmptyObject,
	InstructionParameters,
	ObjectLikeConstraint,
	PackageMetadata,
	ProgramMetadata,
} from "./types";

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
	command: <CommandValues extends ObjectLikeConstraint = EmptyObject>(
		params: CommandParameters,
	) => Termost<CommandValues & Values>;
	input: <Key extends keyof Values>(
		params: InputParameters<Values, Key>,
	) => Termost<Values>;
	option: <Key extends keyof Values>(
		params: OptionParameters<Values, Key>,
	) => Termost<Values>;
	task: <Key extends keyof Values | undefined = undefined>(
		params: TaskParameters<Values, Key>,
	) => Termost<Values>;
};

export function termost<Values extends ObjectLikeConstraint = EmptyObject>(
	metadata: Partial<PackageMetadata> | string,
	callbacks: TerminationCallbacks = {},
) {
	const paramsMetadata: Partial<PackageMetadata> = isObject(metadata)
		? metadata
		: { description: metadata };

	const packageMetadata = getPackageMetadata();
	const programName = paramsMetadata.name ?? packageMetadata.name;
	const { command = programName, operands, options } = getArguments();

	setGracefulListeners(callbacks);

	return createProgram<Values>({
		name: programName,
		description: paramsMetadata.description ?? packageMetadata.description,
		argv: { command, operands, options },
		version: paramsMetadata.version ?? packageMetadata.version,
	});
}

export const createProgram = <Values extends ObjectLikeConstraint>(
	metadata: ProgramMetadata,
): Termost<Values> => {
	const { name, description, argv } = metadata;
	const rootCommandName: CommandName = name;
	let currentCommandName: CommandName = rootCommandName;

	const createInstruction = <
		Parameters extends InstructionParameters<ObjectLikeConstraint>,
	>(
		factory: CreateInstruction<Parameters>,
		params: InstructionParameters<Values>,
	) => {
		const instruction = factory(params as Parameters);
		const controller = getCommandController<Values>(currentCommandName);

		controller.addInstruction(async () => {
			const { skip } = params;
			const context = controller.getContext(rootCommandName);

			if (skip?.(context, argv)) return;

			const output = await instruction(context, argv);

			if (!output || !output.key) return;

			controller.addValue(
				output.key,
				output.value as Values[keyof Values],
			);
		});
	};

	const program: Termost<Values> = {
		command<CommandValues>(params: CommandParameters) {
			currentCommandName = createCommand(params, metadata);

			return this as Termost<CommandValues & Values>;
		},
		input(params) {
			createInstruction(createInput, params);

			return this;
		},
		option(params) {
			createInstruction(
				createOption(
					getCommandController(currentCommandName),
					metadata,
				),
				params,
			);

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

type TerminationCallbacks = Partial<{
	onException: (error: Error) => void;
	onShutdown: () => void;
}>;

const setGracefulListeners = ({
	onException = () => {
		return;
	},
	onShutdown = () => {
		return;
	},
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

const isObject = (value: unknown): value is ObjectLikeConstraint => {
	return value !== null && typeof value === "object";
};
