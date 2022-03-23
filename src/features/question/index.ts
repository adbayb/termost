import prompts, { PromptObject, PromptType } from "prompts";
import {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../types";

export const createQuestion: CreateInstruction<
	QuestionParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { key, defaultValue, label, type } = parameters;
	const mapTypeToPromptType = (): PromptType => {
		switch (type) {
			case "select":
				return "select";
			case "multiselect":
				return "multiselect";
			case "confirm":
				return "confirm";
			case "text":
				return "text";
			default:
				throw new Error(
					`Unknown \`${type}\` type provided to \`question\``
				);
		}
	};

	return async function execute(context) {
		const promptObject: PromptObject = {
			initial: defaultValue,
			message: typeof label === "function" ? label(context) : label,
			name: key,
			type: mapTypeToPromptType(),
		};

		if (parameters.type === "select" || parameters.type === "multiselect") {
			const isMultiSelect = parameters.type === "multiselect";
			const options = parameters.options as Array<string>;
			const choices = options.map((option) => ({
				title: option,
				value: option,
				...(isMultiSelect && {
					selected: ((defaultValue || []) as Array<string>).includes(
						option
					),
				}),
			}));

			// @note: initial value is managed differently between select and multiselect,
			// we need to do some transformation to plug termost API with prompts one...
			if (isMultiSelect) promptObject.initial = undefined;
			else {
				promptObject.initial = options.findIndex(
					(option) => option === defaultValue
				);
			}

			promptObject.choices = choices;
		}

		const data = await prompts(promptObject);

		return { key, value: data[key] };
	};
};

export type QuestionParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values
> = InstructionParameters<
	Values,
	InstructionKey<Key> &
		(
			| {
					type: "text";
					label: Label<Values>;
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
			  }
			| {
					type: "confirm";
					label: Label<Values>;
					defaultValue?: Values[Key] extends boolean
						? Values[Key]
						: never;
			  }
			| {
					type: "select";
					label: Label<Values>;
					options: Values[Key] extends string
						? Array<Values[Key]>
						: never;
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
			  }
			| {
					type: "multiselect";
					label: Label<Values>;
					options: Values[Key] extends Array<string>
						? Values[Key]
						: never;
					defaultValue?: Values[Key] extends Array<string>
						? Values[Key]
						: never;
			  }
		)
>;
