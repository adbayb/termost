import { AsyncQueue } from "../../core/queue";
import { MessageParameters, createMessage } from "../message";
import { OptionParameters, createOption } from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import {
	CommandContext,
	CreateInstruction,
	InstructionParameters,
	ProgramContext,
} from "../types";

export class FluentInterface {
	// @note: soft private through protected access modifier (type checking only but still accessible runtime side)
	// since JavaScript runtime doesn't handle yet access to private field from inherited classes:
	protected programContext: ProgramContext;
	protected commandContext: CommandContext;
	protected manager: AsyncQueue;

	constructor(description: string, programContext?: ProgramContext) {
		this.manager = new AsyncQueue();
		this.programContext = programContext || {
			commandRegistry: [],
			operands: [],
			options: {},
		};
		this.commandContext = {
			values: {},
			metadata: {
				description,
				options: {},
			},
		};
	}

	message(parameters: MessageParameters) {
		return this.#createInstruction(createMessage, parameters);
	}

	option(parameters: OptionParameters) {
		return this.#createInstruction(
			(optionParams) =>
				createOption({
					...optionParams,
					commandContext: this.commandContext,
				}),
			parameters
		);
	}

	question(parameters: QuestionParameters) {
		return this.#createInstruction(createQuestion, parameters);
	}

	task(parameters: TaskParameters) {
		return this.#createInstruction(createTask, parameters);
	}

	#createInstruction<Parameters extends InstructionParameters>(
		createInstruction: CreateInstruction<Parameters>,
		parameters: Parameters
	) {
		const instruction = createInstruction(parameters);

		this.manager.enqueue(async () => {
			const { skip } = parameters;

			if (skip?.(this.commandContext.values)) {
				return;
			}

			const instructionValue = await instruction(
				this.commandContext,
				this.programContext
			);

			if (instructionValue && instructionValue.key) {
				this.commandContext.values[instructionValue.key] =
					instructionValue.value;
			}
		});

		return this;
	}
}
