import { DEFAULT_COMMAND_KEY, globalContext } from "./context";
import { parseArguments } from "./core/parser";
import { Command } from "./features/command";

export const termost = (
	...parameters: ConstructorParameters<typeof Termost>
) => {
	return new Termost(...parameters);
};

class Termost extends Command {
	constructor(description: string) {
		super(DEFAULT_COMMAND_KEY, description);
		this.#setContext();
	}

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command(params: { name: string; description: string }) {
		globalContext.commandRegistry.push(params);

		return new Command(params.name, params.description);
	}

	#setContext() {
		const {
			command = DEFAULT_COMMAND_KEY,
			operands,
			options,
		} = parseArguments();

		globalContext.currentCommand = command;
		globalContext.options = options;
		globalContext.operands = operands;
	}
}
