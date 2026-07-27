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
	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const { key, label, defaultValue, type } = parameters;
	const mappedPromptType = type === "select" || type === "multiselect" ? "autocomplete" : type;

	return async function execute(context, argv) {
		type Choice = { title: string; multiple: boolean; selected?: boolean; value: string };

		const promptObject: Parameters<typeof prompt>[0] & {
			choices?: Choice[];
			limit?: number;
			multiple?: boolean;
		} = {
			name: key,
			// oxlint-disable-next-line typescript/no-unsafe-assignment
			initial: defaultValue,
			message: typeof label === "function" ? label(context, argv) : label,
			type: mappedPromptType,
		};

		if (parameters.type === "select" || parameters.type === "multiselect") {
			const isMultiSelect = parameters.type === "multiselect";
			const options = parameters.options as string[];

			const choices = options.map((option) => {
				const output: Choice = {
					title: option,
					multiple: isMultiSelect,
					value: option,
				};

				if (isMultiSelect) {
					output.selected = ((defaultValue ?? []) as string[]).includes(option);
				}

				return output;
			});

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
	InstructionKey<Key> &
		(
			| {
					defaultValue?: Values[Key] extends boolean ? Values[Key] : never;
					type: "confirm";
			  }
			| {
					defaultValue?: Values[Key] extends readonly string[] | string[]
						? Values[Key][number][]
						: never;
					options: Values[Key] extends readonly string[] | string[] ? Values[Key] : never;
					type: "multiselect";
			  }
			| {
					defaultValue?: Values[Key] extends string ? Values[Key] : never;
					options: Values[Key] extends string
						? readonly Values[Key][] | Values[Key][]
						: never;
					type: "select";
			  }
			| {
					defaultValue?: Values[Key] extends string ? Values[Key] : never;
					type: "text";
			  }
		) & {
			label: Label<Values>;
		}
>;
