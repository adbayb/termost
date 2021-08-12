import { DEFAULT_COMMAND_NAME } from "./constants";
import { parseArguments } from "./core/parser";
import { Command } from "./features/command";

export const termost = (
	...parameters: ConstructorParameters<typeof Termost>
) => {
	return new Termost(...parameters);
};

class Termost extends Command {
	constructor(description: string) {
		super(DEFAULT_COMMAND_NAME, description);
		this.#hydrateContext();
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

	#hydrateContext() {
		const {
			command = DEFAULT_COMMAND_NAME,
			operands,
			options,
		} = parseArguments();

		this.programContext.currentCommand = command;
		this.programContext.options = options;
		this.programContext.operands = operands;
	}
}
