import { ROOT_COMMAND_NAME } from "../../constants";
import { getManager } from "../../helpers/manager";
import {
	CommandParameters,
	OPTION_HELP_NAMES,
	OPTION_VERSION_NAMES,
	createCommand,
} from "../command";
import { MessageParameters, createMessage } from "../message";
import {
	InternalOptionParameters,
	OptionParameters,
	createOption,
} from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import {
	CommandName,
	Context,
	CreateInstruction,
	InstructionParameters,
	ObjectLikeConstraint,
} from "../types";

/**
 * The termost fluent interface API
 */
export type Program<Values extends ObjectLikeConstraint> = {
	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command<CommandValues extends ObjectLikeConstraint>(
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
	// @todo: create context internally and add parameters to build context internally (such as command, programName...)
	context: Context<Values>
): Program<Values> => {
	let currentCommand: CommandName = ROOT_COMMAND_NAME;

	const createInstruction = <Parameters>(
		createInstruction: CreateInstruction<Parameters>,
		params: InstructionParameters<Values>
	) => {
		const instruction = createInstruction(params as Parameters);

		getManager(currentCommand).addInstruction(async () => {
			const { skip } = params;

			if (skip?.(context)) {
				return;
			}

			const instructionValue = await instruction(context);

			if (instructionValue && instructionValue.key) {
				context.values[instructionValue.key as keyof Values] =
					instructionValue.value as Values[keyof Values];
			}
		});
	};

	return {
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
			createInstruction<InternalOptionParameters>(
				(optionParams) =>
					createOption({
						...optionParams,
						context,
					}),
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
};
