import { Dictionary } from "../../core/dictionary";
import { AsyncQueue } from "../../core/queue";
import { MessageParameters, createMessage } from "../message";
import { OptionParameters, createOption } from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import { CreateInstruction, InstructionParameters, Metadata } from "../types";

export class FluentInterface {
	#data: Dictionary;
	// @note: soft private through protected (ie. type checking only but still accessible runtime side)
	// since JavaScript runtime doesn't handle yet access to private field from inherited classes:
	protected instructionManager: AsyncQueue;
	protected metadata: Metadata;

	constructor({
		instructionManager,
		metadata,
	}: {
		instructionManager: AsyncQueue;
		metadata: Metadata;
	}) {
		this.#data = new Dictionary();
		this.instructionManager = instructionManager;
		this.metadata = metadata;
	}

	message(parameters: MessageParameters) {
		return this.#createInstruction(
			(messageParams) =>
				createMessage({
					...messageParams,
					handler: (helpers) => {
						return messageParams.handler(
							helpers,
							this.#data.values()
						);
					},
				}),
			parameters
		);
	}

	option(parameters: OptionParameters) {
		return this.#createInstruction(
			(optionParams) =>
				createOption({
					...optionParams,
					metadata: this.metadata,
				}),
			parameters
		);
	}

	question(parameters: QuestionParameters) {
		return this.#createInstruction(createQuestion, parameters);
	}

	task(parameters: TaskParameters) {
		return this.#createInstruction(
			(taskParams) =>
				createTask({
					...taskParams,
					handler: () => {
						return taskParams.handler(this.#data.values());
					},
				}),
			parameters
		);
	}

	#createInstruction<Parameters extends InstructionParameters>(
		createInstruction: CreateInstruction<Parameters>,
		parameters: Parameters
	) {
		const instruction = createInstruction(parameters);

		this.instructionManager.enqueue(async () => {
			const { key, skip } = parameters;

			if (skip?.(this.#data.values())) {
				return;
			}

			const value = await instruction();

			if (key) {
				this.#data.set(key, value);
			}
		});

		return this;
	}
}
