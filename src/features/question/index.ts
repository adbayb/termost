import inquirer from "inquirer";
import {
	ContextValues,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
} from "../types";

export const createQuestion: CreateInstruction<
	QuestionParameters<ContextValues, keyof ContextValues>
> = (parameters) => {
	const { key, defaultValue, label } = parameters;
	const receiver = inquirer;

	return async function execute(commandContext) {
		const mappedProperties: Record<string, unknown> = {
			name: key,
			default: defaultValue,
		};

		if (
			parameters.type === "select:one" ||
			parameters.type === "select:many"
		) {
			mappedProperties["type"] =
				parameters.type === "select:one" ? "list" : "checkbox";
			mappedProperties.choices = parameters.choices;
		} else if (parameters.type === "confirm") {
			mappedProperties.type = "confirm";
		} else {
			mappedProperties.type = "input";
		}

		mappedProperties.message =
			typeof label === "function" ? label(commandContext.values) : label;

		const data = await receiver.prompt([mappedProperties]);

		return { key, value: data[key] };
	};
};

export type QuestionParameters<
	Values,
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
					type: "select:one";
					label: Label<Values>;
					choices: Values[Key] extends string
						? Array<Values[Key]>
						: never;
					defaultValue?: Values[Key] extends string
						? Values[Key]
						: never;
			  }
			| {
					type: "select:many";
					label: Label<Values>;
					choices: Values[Key] extends Array<string>
						? Values[Key]
						: never;
					defaultValue?: Values[Key] extends Array<string>
						? Values[Key]
						: never;
			  }
		)
>;
