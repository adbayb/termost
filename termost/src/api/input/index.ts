/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prompt } from "enquirer";

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

	return async function execute(context, argv) {
		const promptObject: Parameters<typeof prompt>[0] & {
			choices?: { title: string; value: string; selected?: boolean }[];
		} = {
			initial: defaultValue,
			message: typeof label === "function" ? label(context, argv) : label,
			name: key,
			type,
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
