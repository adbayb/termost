import args from "args";
import { AskCommand } from "./commands/ask";
import { Dictionary } from "./core/dataStructure";
import { TaskManager } from "./core/taskManager";
import { LaunchCommand } from "./commands/launch";
import { Command, GetCommandParameters } from "./commands/types";

export class Terminal {
	#taskManager: TaskManager;
	#context: Dictionary;

	constructor() {
		this.#context = new Dictionary();
		this.#taskManager = new TaskManager();
	}

	ask({ skip, ...restParams }: FluentAskParameters) {
		const command = new AskCommand(restParams);

		args.option(restParams.key, "TODO");

		this.#taskManager.register(this.#createTask(command, skip));

		return this;
	}

	command({ skip, handler, ...restParams }: FluentCommandParameters) {
		const command = new LaunchCommand({
			...restParams,
			handler: () => {
				return handler(this.#context.values());
			},
		});

		this.#taskManager.register(this.#createTask(command, skip));

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

	start() {
		args.parse(process.argv);

		const run = async () => {
			await this.#taskManager.start();

			console.info("\nContext = ", this.#context.values());
		};

		run();

		const stop = () => this.#taskManager.stop();

		return function cleanup() {
			stop();
		};
	}
}

type FluentCommonParameters = {
	skip?: (contextValues: ReturnType<Dictionary["values"]>) => boolean;
};

type FluentAskParameters = GetCommandParameters<typeof AskCommand> &
	FluentCommonParameters;

type FluentCommandParameters = Omit<
	GetCommandParameters<typeof LaunchCommand>,
	"handler"
> & {
	handler: (
		contextValues: ReturnType<Dictionary["values"]>
	) => ReturnType<Command["execute"]>;
} & FluentCommonParameters;
