import args from "args";
import minimist from "minimist";
import { OptionHandler, OptionHandlerParameters } from "./handlers/option";
import { Dictionary } from "./core/dataStructure";
import { CommandManager } from "./core/commandManager";
import { TaskHandler, TaskHandlerParameters } from "./handlers/task";
import { Handler } from "./handlers/types";
import { InputHandler, InputHandlerParameters } from "./handlers/input";

// console.log(
// 	// @ts-ignore
// 	(new toto.Args() as typeof args)
// 		.option("toto", "titi", 56)
// 		.parse(process.argv)
// );

class Terminal {
	constructor() {
		// @note: side effect to allow help command being run before other commands
		console.log(minimist(process.argv.slice(2)));
		args.parse(process.argv);
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
		args.command(name, "todo desc");

		return new Command();
	}
}

class Command {
	#manager: CommandManager;
	#context: Dictionary;

	constructor() {
		this.#context = new Dictionary();
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
						return handler(this.#context.values());
					},
				}),
				skip
			)
		);

		return this;
	}

	#createTask(handler: Handler, skip: FluentCommonParameters["skip"]) {
		return async () => {
			if (skip?.(this.#context.values())) {
				return;
			}

			const { key, value } = await handler.execute();

			this.#context.set(key, value);
		};
	}

	run() {
		const run = async () => {
			await this.#manager.start();

			console.info("\nContext = ", this.#context.values());
		};

		run();

		const stop = () => this.#manager.stop();

		return function cleanup() {
			stop();
		};
	}
}

type FluentCommonParameters = {
	skip?: (contextValues: ReturnType<Dictionary["values"]>) => boolean;
};

type FluentOptionParameters = OptionHandlerParameters & FluentCommonParameters;

type FluentInputParameters = InputHandlerParameters & FluentCommonParameters;

type FluentTaskParameters = Omit<TaskHandlerParameters, "handler"> & {
	handler: (
		contextValues: ReturnType<Dictionary["values"]>
	) => ReturnType<Handler["execute"]>;
} & FluentCommonParameters;

export const terminal = new Terminal();
