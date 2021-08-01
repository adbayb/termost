import { Context, DEFAULT_COMMAND_KEY, globalContext } from "../../context";
import { Dictionary } from "../../core/dictionary";
import { Command } from "./command";

class Terminal {
	constructor() {
		this.#setContext();
	}

	/**
	 * Attaches the top level command
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	program(description: string) {
		return new Command(DEFAULT_COMMAND_KEY, description);
	}

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command(params: { name: string; description: string }) {
		return new Command(params.name, params.description);
	}

	#setContext() {
		const { command, operands, options } = this.#parseArguments();

		globalContext.command = command;
		globalContext.options = options;
		globalContext.operands = operands;
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	#parseArguments() {
		const parameters = process.argv.slice(2);
		const restArguments: Array<string> = [];

		type OptionValue = Context["options"][number];

		const options = new Dictionary<OptionValue>();
		let currentOption: string | undefined = undefined;

		const castValue = (value?: string) => {
			if (value === undefined) {
				return true;
			}

			try {
				return JSON.parse(value) as OptionValue;
			} catch {
				return value;
			}
		};

		const flushOption = (value?: string) => {
			if (currentOption) {
				options.set(currentOption, castValue(value));
				currentOption = undefined;
			}
		};

		for (const param of parameters) {
			if (param[0] !== "-") {
				if (!currentOption) {
					restArguments.push(param);
				} else {
					flushOption(param);
				}

				continue;
			}

			const isLongFlag = param[1] === "-";
			const flagParams = isLongFlag
				? [param.slice(2)]
				: [...param.slice(1)];
			const lastFlagIndex = flagParams.length - 1;

			for (let i = 0; i <= lastFlagIndex; i++) {
				const flag = flagParams[i] as string;

				if (i === lastFlagIndex) {
					flushOption();
					currentOption = flag;
				} else {
					options.set(flag, true);
				}
			}
		}

		flushOption();

		const [command = DEFAULT_COMMAND_KEY, ...operands] = restArguments;

		return { command, operands, options: options.values() };
	}
}

export const terminal = new Terminal();
