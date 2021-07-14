import args from "args";
import { AskParameters, AskPlugin } from "./plugins/ask";
import { Dictionary } from "./core/dataStructure";
import { TaskManager } from "./core/taskManager";
import { CommandPlugin } from "./plugins/command";
import { Plugin } from "./plugins/types";

type FluentLifecycle = {
	skip?: (contextValues: ReturnType<Dictionary["values"]>) => boolean;
};

export class Terminal {
	#taskManager: TaskManager;
	#context: Dictionary;

	constructor() {
		this.#context = new Dictionary();
		this.#taskManager = new TaskManager();
	}

	ask({ skip, ...restParams }: AskParameters & FluentLifecycle): Terminal {
		const plugin = new AskPlugin(restParams);

		args.option(restParams.key, "TODO");

		this.#taskManager.register(this.#createTask(plugin, skip));

		return this;
	}

	command(
		params: {
			key: string;
			label: string;
			handler: (
				contextValues: ReturnType<Dictionary["values"]>
			) => Promise<{ key: string; value: unknown }>;
		} & FluentLifecycle
	): Terminal {
		const plugin = new CommandPlugin(
			params.key,
			params.label,
			this.#context,
			params.skip || (() => false),
			params.handler
		);

		this.#taskManager.register(this.#createTask(plugin, params.skip));

		return this;
	}

	#createTask(plugin: Plugin, skip: FluentLifecycle["skip"]) {
		return async () => {
			if (skip?.(this.#context.values())) {
				return;
			}

			const value = plugin.execute();

			this.#context.set(plugin.key(), value);
		};
	}

	start() {
		args.parse(process.argv);
		this.#run();

		const stop = () => this.#taskManager.stop();

		return function cleanup() {
			stop();
		};
	}

	async #run() {
		this.#taskManager.start();
	}
}
