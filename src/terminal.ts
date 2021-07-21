import { OptionHandler, OptionHandlerParameters } from "./handlers/option";
import { Dictionary } from "./core/dataStructure";
import { CommandManager } from "./core/commandManager";
import { TaskHandler, TaskHandlerParameters } from "./handlers/task";
import { Handler } from "./handlers/types";
import { InputHandler, InputHandlerParameters } from "./handlers/input";

type Context = {
	commandName?: string;
	flags?: Record<string, boolean | string>;
};

// @todo: event emitter to manage global context and event dispatch
const globalContext: Context = {};

class Terminal {
	constructor() {
		this.#setContext();
	}

	// @note: the program is the top level command
	/**
	 * The top level command
	 */
	program = new Command();

	/**
	 * Allows to attach a new sub-command to the program
	 * @param name - The CLI command name
	 * @returns The Command API
	 */
	command(name: string) {
		return new Command(name);
	}

	#setContext() {
		const { args, flags } = this.#parseParameters();
		const commandName = args[0];

		console.log({ args, flags });

		globalContext.commandName = commandName;
		globalContext.flags = flags;
	}

	#parseParameters() {
		const parameters = process.argv.slice(2);
		const args: string[] = [];
		const flags = new Dictionary<boolean | string>();
		let currentFlag: string | undefined = undefined;
		const castValue = (value: string | boolean) => {
			return value;
		};
		const flushFlag = (value: string | boolean = true) => {
			if (currentFlag) {
				flags.set(currentFlag, castValue(value));
				currentFlag = undefined;
			}
		};

		for (const param of parameters) {
			if (param[0] !== "-") {
				if (!currentFlag) {
					args.push(param);
				} else {
					flushFlag(param);
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
					flushFlag();
					currentFlag = flag;
				} else {
					flags.set(flag, true);
				}
			}
		}

		flushFlag();

		return { args, flags: flags.values() };
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

	input({ skip, ...restParams }: FluentInputParameters) {
		this.#manager.register(
			this.#createTask(new InputHandler(restParams), skip)
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
		if (
			this.#name !== undefined &&
			globalContext.commandName !== this.#name
		) {
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

type FluentInputParameters = InputHandlerParameters & FluentCommonParameters;

type FluentTaskParameters = Omit<TaskHandlerParameters, "handler"> & {
	handler: (
		data: ReturnType<Dictionary["values"]>
	) => ReturnType<Handler["execute"]>;
} & FluentCommonParameters;

export const terminal = new Terminal();
