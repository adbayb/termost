import args from "args";
import { OptionCommand, OptionCommandParameters } from "./commands/option";
import { Dictionary } from "./core/dataStructure";
import { CommandManager } from "./core/commandManager";
import { TaskCommand, TaskCommandParameters } from "./commands/task";
import { Command } from "./commands/types";

// console.log(
// 	// @ts-ignore
// 	(new toto.Args() as typeof args)
// 		.option("toto", "titi", 56)
// 		.parse(process.argv)
// );

export class Terminal {
	#manager: CommandManager;
	#context: Dictionary;

	constructor() {
		this.#context = new Dictionary();
		this.#manager = new CommandManager();

		// @note: side effect to allow help command being run before other commands
		args.parse(process.argv);
	}

	option({ skip, ...restParams }: FluentOptionParameters) {
		const command = new OptionCommand(restParams);

		this.#manager.register(this.#createTask(command, skip));

		return this;
	}

	task({ skip, handler, ...restParams }: FluentTaskParameters) {
		const command = new TaskCommand({
			...restParams,
			handler: () => {
				return handler(this.#context.values());
			},
		});

		this.#manager.register(this.#createTask(command, skip));

		return this;
	}

	#createTask(command: Command, skip: FluentCommonParameters["skip"]) {
		return async () => {
			if (skip?.(this.#context.values())) {
				return;
			}

			const { key, value } = await command.execute();

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

type FluentOptionParameters = OptionCommandParameters & FluentCommonParameters;

type FluentTaskParameters = Omit<TaskCommandParameters, "handler"> & {
	handler: (
		contextValues: ReturnType<Dictionary["values"]>
	) => ReturnType<Command["execute"]>;
} & FluentCommonParameters;
