/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PromptObject, PromptType } from "prompts";
import prompts from "prompts";

import type {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../../types";

export const createInput: CreateInstruction<
	InputParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
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
					`Unknown \`${type as string}\` type provided to \`input\``,
				);
		}
	};

	return async function execute(context, argv) {
		const promptObject: PromptObject = {
			initial: defaultValue,
			message: typeof label === "function" ? label(context, argv) : label,
			name: key,
			type: mapTypeToPromptType(),
		};

		if (parameters.type === "select" || parameters.type === "multiselect") {
			const isMultiSelect = parameters.type === "multiselect";
			const options = parameters.options as string[];

			const choices = options.map((option) => ({
				title: option,
				value: option,
				...(isMultiSelect && {
					selected: ((defaultValue || []) as string[]).includes(
						option,
					),
				}),
			}));

			// @note: initial value is managed differently between select and multiselect,
			// we need to do some transformation to plug termost API with prompts one...
			if (isMultiSelect) promptObject.initial = undefined;
			else {
				const foundIndex = options.findIndex(
					(option) => option === defaultValue,
				);

				promptObject.initial = foundIndex >= 0 ? foundIndex : undefined;
			}

			promptObject.choices = choices;
		}

		const data = await prompts(promptObject);

		return { key, value: data[key] };
	};
};

export type InputParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values,
> = InstructionParameters<
	Values,
	InstructionKey<Key> &
		(
			| {
					type: "confirm";
					label: Label<Values>;
					defaultValue?: Values[Key] extends boolean
						? Values[Key]
						: never;
			  }
			| {
					type: "multiselect";
					label: Label<Values>;
					options: Values[Key] extends string[] ? Values[Key] : never;
					defaultValue?: Values[Key] extends string[]
						? Values[Key]
						: never;
			  }
			| {
					type: "select";
					label: Label<Values>;
					options: Values[Key] extends string ? Values[Key][] : never;
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
			  }
			| {
					type: "text";
					label: Label<Values>;
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
			  }
		)
>;
