import { Context, globalContext } from "../../context";
import { Dictionary } from "../../core/dictionary";
import { Command } from "./command";

// @todo: include it in context:
class HelpBuilder extends Dictionary<string> {
	// #data:
}

class Terminal {
	/**
	 * The top level command
	 */
	program = new Command();
	#helpBuilder = new HelpBuilder();

	constructor() {
		this.#setContext();
	}

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @param description - The CLI command description
	 * @returns The Command API
	 */
	command(name: string, description: string) {
		this.#helpBuilder.set(name, description);

		return new Command(name);
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

		const [command, ...operands] = restArguments;

		return { command, operands, options: options.values() };
	}

	// @todo: flags/args management
	// @todo: built-in flags --help and --version
}

export const terminal = new Terminal();
