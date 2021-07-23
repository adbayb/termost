import inquirer from "inquirer";
import { Handler, HandlerParameters } from "./types";

export class QuestionHandler implements Handler {
	constructor(private properties: QuestionHandlerParameters) {}

	async execute() {
		const { key, defaultValue } = this.properties;

		const mappedProperties: Record<string, unknown> = {
			name: key,
			default: defaultValue,
		};

		if (
			this.properties.type === "select:one" ||
			this.properties.type === "select:many"
		) {
			mappedProperties["type"] =
				this.properties.type === "select:one" ? "list" : "checkbox";
			mappedProperties.choices = this.properties.choices;
			mappedProperties.message = this.properties.label;
		} else if (this.properties.type === "confirm") {
			mappedProperties.type = "confirm";
			mappedProperties.message = this.properties.label;
		} else {
			mappedProperties.type = "input";
			mappedProperties.message = this.properties.label;
		}

		const data = await inquirer.prompt([mappedProperties]);

		return { key, value: data[key] };
	}
}

export type QuestionHandlerParameters = HandlerParameters<
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
>;
