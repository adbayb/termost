import { autocomplete, autocompleteMultiselect, confirm, isCancel, text } from "@clack/prompts";
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
	// oxlint-disable-next-line typescript/no-unsafe-assignment
	const { key, label, defaultValue, type } = parameters;

	return async function execute(context, argv) {
		const message = typeof label === "function" ? label(context, argv) : label;
		let value: unknown;

		switch (type) {
			case "confirm": {
				value = await confirm({
					message,
					...(defaultValue === undefined
						? {}
						: { initialValue: defaultValue as boolean }),
				});

				break;
			}
			case "multiselect": {
				const options = (parameters.options as string[]).map((option) => {
					return {
						label: option,
						value: option,
					};
				});

				value = await autocompleteMultiselect({
					initialValues: (defaultValue ?? []) as string[],
					maxItems: 10,
					message,
					options,
					required: false,
				});

				break;
			}
			case "select": {
				const options = (parameters.options as string[]).map((option) => {
					return {
						label: option,
						value: option,
					};
				});

				value = await autocomplete({
					maxItems: 10,
					message,
					options,
					...(defaultValue === undefined ? {} : { initialValue: defaultValue as string }),
				});

				break;
			}
			case "text": {
				value = await text({
					message,
					...(defaultValue === undefined ? {} : { initialValue: defaultValue as string }),
				});

				break;
			}
			default: {
				throw new Error(`Unsupported input type: ${type as string}`);
			}
		}

		if (isCancel(value)) {
			throw new Error("The prompt has been cancelled.");
		}

		return { key, value };
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
