/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import enquirer from "enquirer";

import type {
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../../types";

const { prompt } = enquirer;

export const createInput: CreateInstruction<
	InputParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { key, label, defaultValue, type } = parameters;

	const mappedPromptType =
		type === "select" || type === "multiselect" ? "autocomplete" : type;

	return async function execute(context, argv) {
		const promptObject: Parameters<typeof prompt>[0] & {
			choices?: { title: string; selected?: boolean; value: string }[];
			limit?: number;
			multiple?: boolean;
		} = {
			name: key,
			initial: defaultValue,
			message: typeof label === "function" ? label(context, argv) : label,
			type: mappedPromptType,
		};

		if (parameters.type === "select" || parameters.type === "multiselect") {
			const isMultiSelect = parameters.type === "multiselect";
			const options = parameters.options as string[];

			const choices = options.map((option) => ({
				title: option,
				multiple: isMultiSelect,
				...(isMultiSelect && {
					selected: ((defaultValue ?? []) as string[]).includes(
						option,
					),
				}),
				value: option,
			}));

			promptObject.limit = 10;
			promptObject.multiple = isMultiSelect;
			promptObject.choices = choices;
		}

		const data = await prompt<ObjectLikeConstraint>(promptObject);

		return { key, value: data[key] };
	};
};

export type InputParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values,
> = InstructionParameters<
	Values,
	InstructionKey<Key> & {
		label: Label<Values>;
	} & (
			| {
					defaultValue?: Values[Key] extends
						| string[]
						| readonly string[]
						? Values[Key][number][]
						: never;
					options: Values[Key] extends string[] | readonly string[]
						? Values[Key]
						: never;
					type: "multiselect";
			  }
			| {
					defaultValue?: Values[Key] extends boolean
						? Values[Key]
						: never;
					type: "confirm";
			  }
			| {
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
					options: Values[Key] extends string
						? Values[Key][] | readonly Values[Key][]
						: never;
					type: "select";
			  }
			| {
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
					type: "text";
			  }
		)
>;
