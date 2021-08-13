/* eslint-disable padding-line-between-statements */
import { DEFAULT_COMMAND_NAME } from "./constants";
import { getPackageMetadata } from "./core/package";
import { parseArguments } from "./core/parser";
import { Command } from "./features/command";
import { ProgramContext } from "./features/types";

export function termost(configuration: {
	name: string;
	description: string;
	version: string;
}): Termost;
export function termost(description: string): Termost;
export function termost(parameter: any): Termost {
	let description: string;
	let name: string;
	let version: string;
	const {
		command = DEFAULT_COMMAND_NAME,
		operands,
		options,
	} = parseArguments();

	if (isObject(parameter)) {
		description = parameter.description;
		name = parameter.name;
		version = parameter.version;
	} else {
		const packageMetadata = getPackageMetadata();
		description = parameter;
		name = packageMetadata.name;
		version = packageMetadata.version;
	}

	const programContext = {
		commandRegistry: [],
		currentCommand: command,
		name,
		operands,
		options,
		version,
	};

	return new Termost(description, programContext);
}

export class Termost extends Command {
	constructor(description: string, programContext: ProgramContext) {
		super(DEFAULT_COMMAND_NAME, description, programContext);
	}

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command(params: { name: string; description: string }) {
		this.programContext.commandRegistry.push(params);

		return new Command(
			params.name,
			params.description,
			this.programContext
		);
	}
}

const isObject = (value: unknown): value is Record<string, any> => {
	return value !== null && typeof value === "object";
};
