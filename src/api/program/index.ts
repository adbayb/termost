import { getManager } from "../../helpers/manager";
import {
	CommandParameters,
	OPTION_HELP_NAMES,
	OPTION_VERSION_NAMES,
	createCommand,
} from "../command";
import { MessageParameters, createMessage } from "../message";
import { OptionParameters, createOption } from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import {
	CommandName,
	CreateInstruction,
	EmptyContext,
	InstructionParameters,
	Metadata,
	ObjectLikeConstraint,
} from "../../types";

/**
 * The termost fluent interface API
 */
export type Program<Values extends ObjectLikeConstraint = EmptyContext> = {
	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command<CommandValues extends ObjectLikeConstraint = EmptyContext>(
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
	// @todo: rename context variable to metadata
	context: Metadata
): Program<Values> => {
	const rootCommand = context.name;
	let currentCommand: CommandName = context.name;

	const createInstruction = <Parameters>(
		createInstruction: CreateInstruction<Parameters>,
		params: InstructionParameters<Values>
	) => {
		const instruction = createInstruction(params as Parameters);
		const manager = getManager<Values>(currentCommand);

		manager.addInstruction(async () => {
			const { skip } = params;
			const context = manager.getContext(rootCommand);

			if (skip?.(context)) {
				return;
			}

			const output = await instruction(context);

			if (output && output.key) {
				manager.addValue(
					output.key,
					output.value as Values[keyof Values]
				);
			}
		});
	};

	const program: Program<Values> = {
		command({ name, description }) {
			currentCommand = createCommand({
				name,
				description,
				context,
			});

			this.option({
				name: {
					long: OPTION_HELP_NAMES[0],
					short: OPTION_HELP_NAMES[1],
				},
				description: "Display the help center",
			} as any).option({
				name: {
					long: OPTION_VERSION_NAMES[0],
					short: OPTION_VERSION_NAMES[1],
				},
				description: "Print the version",
			} as any);

			return this as Program<any>;
		},
		message(params) {
			createInstruction(createMessage, params);

			return this;
		},
		option(params) {
			createInstruction(createOption(context), params);

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
		name: context.name,
		description: context.description,
	});

	return program;
};
