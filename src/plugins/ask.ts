import inquirer from "inquirer";
import { Plugin, PluginCommonProperties } from "./types";

export class AskPlugin implements Plugin {
	constructor(public properties: AskParameters) {}

	key() {
		return this.properties.key;
	}

	execute() {
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

		return inquirer.prompt([mappedProperties]);
	}
}

type AskSingleSelectParameters = {
	type: "select:single";
	choices: Array<string>;
	defaultValue?: string;
};

type AskMultiSelectParameters = {
	type: "select:multiple";
	choices: Array<string>;
	defaultValue?: Array<string>;
};

type AskInputParameters = {
	type?: "input";
	defaultValue?: string;
};

type AskConfirmParameters = {
	type?: "confirm";
	defaultValue?: boolean;
};

export type AskParameters = PluginCommonProperties &
	(
		| AskInputParameters
		| AskConfirmParameters
		| AskSingleSelectParameters
		| AskMultiSelectParameters
	);
