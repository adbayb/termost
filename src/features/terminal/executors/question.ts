import inquirer from "inquirer";
import { Executor, ExecutorInput } from "./types";

export class QuestionHandler implements Executor {
	#receiver = inquirer;

	constructor(private properties: QuestionExecutorInput) {}

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

		const data = await this.#receiver.prompt([mappedProperties]);

		return { key, value: data[key] };
	}
}

export type QuestionExecutorInput = ExecutorInput<
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
