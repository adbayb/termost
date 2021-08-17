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

export type QuestionParameters<Values, Key> = InstructionParameters<
	Values,
	InstructionKey<Key> &
		(
			| {
					type: "text";
					label: Label<Values>;
					defaultValue?: string;
			  }
			| {
					type: "confirm";
					label: Label<Values>;
					defaultValue?: boolean;
			  }
			| {
					type: "select:one";
					label: Label<Values>;
					choices: Array<string>;
					defaultValue?: string;
			  }
			| {
					type: "select:many";
					label: Label<Values>;
					choices: Array<string>;
					defaultValue?: Array<string>;
			  }
		)
>;
