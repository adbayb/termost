import { AsyncQueue } from "../../core/queue";
import { MessageParameters, createMessage } from "../message";
import { OptionParameters, createOption } from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import {
	CommandContext,
	CreateInstruction,
	InstructionParameters,
} from "../types";

export class FluentInterface {
	// @note: soft private through protected (ie. type checking only but still accessible runtime side)
	// since JavaScript runtime doesn't handle yet access to private field from inherited classes:
	protected context: CommandContext;
	protected manager: AsyncQueue;

	constructor(description: string) {
		this.manager = new AsyncQueue();
		this.context = {
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
					context: this.context,
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
			const { key, skip } = parameters;

			if (skip?.(this.context.values)) {
				return;
			}

			const value = await instruction(this.context);

			if (key) {
				this.context.values[key] = value;
			}
		});

		return this;
	}
}
