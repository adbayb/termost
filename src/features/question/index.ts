import inquirer from "inquirer";
import { Instruction, InstructionParameters } from "../types";

export const createQuestion = (parameters: QuestionParameters): Instruction => {
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

export type QuestionParameters = InstructionParameters<
	{ key: string } & (
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
