import {
	CommandParameters,
	createCommand,
	getCommandController,
} from "../command";
import { MessageParameters, createMessage } from "../message";
import { OptionParameters, createOption } from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import {
	CommandName,
	CreateInstruction,
	EmptyObject,
	InstructionParameters,
	ObjectLikeConstraint,
	ProgramMetadata,
} from "../../types";

/**
 * The termost fluent interface API
 */
export type Program<Values extends ObjectLikeConstraint = EmptyObject> = {
	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command<CommandValues extends ObjectLikeConstraint = EmptyObject>(
		params: CommandParameters
	): Program<Values & CommandValues>;
	message(params: MessageParameters<Values>): Program<Values>;
	option<Key>(params: OptionParameters<Values, Key>): Program<Values>;
	question<Key extends keyof Values>(
		params: QuestionParameters<Values, Key>
	): Program<Values>;
	task<Key>(params: TaskParameters<Values, Key>): Program<Values>;
};

export const createProgram = <Values extends ObjectLikeConstraint>(
	metadata: ProgramMetadata
): Program<Values> => {
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

	const program: Program<Values> = {
		command<CommandValues>(params: CommandParameters) {
			currentCommandName = createCommand(params, metadata);

			return this as Program<CommandValues & Values>;
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
