import args from "args";
import inquirer from "inquirer";
import { Command, CommandParameters } from "./types";

export class OptionCommand implements Command {
	constructor(private properties: OptionCommandParameters) {}

	async execute() {
		if (
			this.properties.type === "args" ||
			this.properties.type === undefined
		) {
			const { key, description, defaultValue } = this.properties;

			args.option(key, description, defaultValue);

			const flags = args.parse(process.argv);

			return { key, value: flags[key] };
		}

		const { key, defaultValue } = this.properties;

		const mappedProperties: Record<string, unknown> = {
			name: key,
			default: defaultValue,
		};

		if (
			this.properties.type === "select:multiple" ||
			this.properties.type === "select:single"
		) {
			mappedProperties["type"] =
				this.properties.type === "select:single" ? "list" : "checkbox";
			mappedProperties.choices = this.properties.choices;
			mappedProperties.message = this.properties.label;
		} else if (this.properties.type === "confirm") {
			mappedProperties.type = "confirm";
			mappedProperties.message = this.properties.label;
		} else if (this.properties.type === "input") {
			mappedProperties.type = "input";
			mappedProperties.message = this.properties.label;
		}

		const data = await inquirer.prompt([mappedProperties]);

		return { key, value: data[key] };
	}
}

export type OptionCommandParameters = CommandParameters<
	| {
			type?: "args";
			description: string;
			defaultValue?: string | number | boolean;
	  }
	| {
			type: "input";
			label: string;
			defaultValue?: string;
	  }
	| {
			type: "confirm";
			label: string;
			defaultValue?: boolean;
	  }
	| {
			type: "select:single";
			label: string;
			choices: Array<string>;
			defaultValue?: string;
	  }
	| {
			type: "select:multiple";
			label: string;
			choices: Array<string>;
			defaultValue?: Array<string>;
	  }
>;
