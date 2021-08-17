import inquirer from "inquirer";
import {
	ContextValues,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
} from "../types";

export const createQuestion: CreateInstruction<
	QuestionParameters<ContextValues, keyof ContextValues>
> = (parameters) => {
	const { key, defaultValue } = parameters;
	const receiver = inquirer;

	return async function execute() {
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
			mappedProperties.message = parameters.label;
		} else if (parameters.type === "confirm") {
			mappedProperties.type = "confirm";
			mappedProperties.message = parameters.label;
		} else {
			mappedProperties.type = "input";
			mappedProperties.message = parameters.label;
		}

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
					label: string;
					defaultValue?: string;
			  }
			| {
					type: "confirm";
					label: string;
					defaultValue?: boolean;
			  }
			| {
					type: "select:one";
					label: string;
					choices: Array<string>;
					defaultValue?: string;
			  }
			| {
					type: "select:many";
					label: string;
					choices: Array<string>;
					defaultValue?: Array<string>;
			  }
		)
>;
