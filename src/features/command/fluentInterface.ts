import { AsyncQueue } from "../../core/queue";
import { MessageParameters, createMessage } from "../message";
import {
	InternalOptionParameters,
	OptionParameters,
	createOption,
} from "../option";
import { QuestionParameters, createQuestion } from "../question";
import { TaskParameters, createTask } from "../task";
import { Context, CreateInstruction, InstructionParameters } from "../types";

export class FluentInterface<Values> {
	// @note: soft private through protected access modifier (type checking only but still accessible runtime side)
	// since JavaScript runtime doesn't handle yet access to private field from inherited classes:
	protected context: Context<Values>;
	protected manager: AsyncQueue;

	constructor(context: Context<Values>) {
		this.manager = new AsyncQueue();
		this.context = context;
	}

	message(parameters: MessageParameters<Values>) {
		return this.#createInstruction(createMessage, parameters);
	}

	// @note: for option and task, we do not enforce generic constraint through extends keyword
	// since we need to manage different API behaviors based upon Key being a key of Values or not (ie. non defined key)
	// By default, `extends` acts also as a default value if the targetted key is not specified
	// (ie. `Key extends keyof Values` is inferred as `keyof Values` even if key is not explicitly defined consumer side)
	option<Key>(parameters: OptionParameters<Values, Key>) {
		return this.#createInstruction<InternalOptionParameters>(
			(optionParams) =>
				createOption({
					...optionParams,
					context: this.context,
				}),
			parameters
		);
	}

	question<Key extends keyof Values>(
		parameters: QuestionParameters<Values, Key>
	) {
		return this.#createInstruction(createQuestion, parameters);
	}

	task<Key>(parameters: TaskParameters<Values, Key>) {
		return this.#createInstruction(createTask, parameters);
	}

	#createInstruction<Parameters>(
		createInstruction: CreateInstruction<Parameters>,
		parameters: InstructionParameters<Values>
	) {
		const instruction = createInstruction(parameters as Parameters);

		this.manager.enqueue(async () => {
			const { skip } = parameters;

			if (skip?.(this.context)) {
				return;
			}

			const instructionValue = await instruction(this.context);

			if (instructionValue && instructionValue.key) {
				this.context.values[instructionValue.key as keyof Values] =
					instructionValue.value;
			}
		});

		return this;
	}
}
