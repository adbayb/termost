import inquirer from "inquirer";
import { Command, CommandParameters } from "./types";

export class OptionCommand implements Command {
	constructor(private properties: OptionCommandParameters) {}

	async execute() {
		const { key, label, defaultValue } = this.properties;
		const mappedProperties: Record<string, unknown> = {
			name: key,
			message: label,
			default: defaultValue,
		};

		switch (this.properties.type) {
			case "select:multiple":
			case "select:single":
				mappedProperties["type"] =
					this.properties.type === "select:single"
						? "list"
						: "checkbox";
				mappedProperties.choices = this.properties.choices;

				break;
			case "confirm":
				mappedProperties.type = "confirm";

				break;
			case "input":
			default:
				mappedProperties.type = "input";

				break;
		}

		const data = await inquirer.prompt([mappedProperties]);

		return { key, value: data[key] };
	}
}

export type OptionCommandParameters = CommandParameters<
	| {
			type?: "input";
			defaultValue?: string;
	  }
	| {
			type?: "confirm";
			defaultValue?: boolean;
	  }
	| {
			type: "select:single";
			choices: Array<string>;
			defaultValue?: string;
	  }
	| {
			type: "select:multiple";
			choices: Array<string>;
			defaultValue?: Array<string>;
	  }
>;
