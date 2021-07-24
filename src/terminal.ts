import { OptionHandler, OptionHandlerParameters } from "./handlers/option";
import { Dictionary } from "./core/dataStructure";
import { CommandManager } from "./core/commandManager";
import { TaskHandler, TaskHandlerParameters } from "./handlers/task";
import { Handler } from "./handlers/types";
import {
	QuestionHandler,
	QuestionHandlerParameters,
} from "./handlers/question";
import { Context, globalContext } from "./context";

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

class Command {
	#name: string | undefined;
	#manager: CommandManager;
	#data: Dictionary;

	constructor(name?: string) {
		this.#name = name;
		this.#data = new Dictionary();
		this.#manager = new CommandManager();
	}

	option({ skip, ...restParams }: FluentOptionParameters) {
		this.#manager.register(
			this.#createTask(new OptionHandler(restParams), skip)
		);

		return this;
	}

	question({ skip, ...restParams }: FluentQuestionParameters) {
		this.#manager.register(
			this.#createTask(new QuestionHandler(restParams), skip)
		);

		return this;
	}

	task({ skip, handler, ...restParams }: FluentTaskParameters) {
		this.#manager.register(
			this.#createTask(
				new TaskHandler({
					...restParams,
					handler: () => {
						return handler(this.#data.values());
					},
				}),
				skip
			)
		);

		return this;
	}

	#createTask(handler: Handler, skip: FluentCommonParameters["skip"]) {
		return async () => {
			if (skip?.(this.#data.values())) {
				return;
			}

			const { key, value } = await handler.execute();

			this.#data.set(key, value);
		};
	}

	run() {
		if (this.#name !== undefined && globalContext.command !== this.#name) {
			// @note: named command are run only if it matches the current command name
			return;
		}

		const run = async () => {
			await this.#manager.start();

			console.info("\nContext = ", this.#data.values());
		};

		run();

		const stop = () => this.#manager.stop();

		return function cleanup() {
			stop();
		};
	}
}

type FluentCommonParameters = {
	skip?: (data: ReturnType<Dictionary["values"]>) => boolean;
};

type FluentOptionParameters = OptionHandlerParameters & FluentCommonParameters;

type FluentQuestionParameters = QuestionHandlerParameters &
	FluentCommonParameters;

type FluentTaskParameters = Omit<TaskHandlerParameters, "handler"> & {
	handler: (
		data: ReturnType<Dictionary["values"]>
	) => ReturnType<Handler["execute"]>;
} & FluentCommonParameters;

export const terminal = new Terminal();
