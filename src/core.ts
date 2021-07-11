import args from "args";
import inquirer from "inquirer";

type Context = Record<string, unknown>;

type ArgsLifecycle = {
	skip?: (ctx: Context) => boolean;
};

abstract class AsyncCommand {
	abstract execute(): Promise<unknown>;
}

type AskPluginCommonParams = {
	key: string;
	label: string;
};

type AskPluginSingleSelectParams = {
	type: "select:single";
	choices: Array<string>;
	defaultValue?: string;
};

type AskPluginMultiSelectParams = {
	type: "select:multiple";
	choices: Array<string>;
	defaultValue?: Array<string>;
};

type AskPluginInputParams = {
	type?: "input";
	defaultValue?: string;
};

type AskPluginConfirmParams = {
	type?: "confirm";
	defaultValue?: boolean;
};

type AskPluginParams = AskPluginCommonParams &
	(
		| AskPluginInputParams
		| AskPluginConfirmParams
		| AskPluginSingleSelectParams
		| AskPluginMultiSelectParams
	);

class AskPlugin extends AsyncCommand {
	parameters: AskPluginParams;

	constructor(params: AskPluginParams) {
		super();
		this.parameters = params;
	}

	adaptToInquirerParams() {
		const { key, label, defaultValue } = this.parameters;
		const inquirerParams: Record<string, unknown> = {
			name: key,
			message: label,
			default: defaultValue,
		};

		switch (this.parameters.type) {
			case "select:multiple":
			case "select:single":
				inquirerParams["type"] =
					this.parameters.type === "select:single"
						? "list"
						: "checkbox";
				inquirerParams.choices = this.parameters.choices;

				break;
			case "confirm":
				inquirerParams.type = "confirm";

				break;
			case "input":
			default:
				inquirerParams.type = "input";

				break;
		}

		return inquirerParams;
	}

	execute() {
		return inquirer.prompt([this.adaptToInquirerParams()]);
	}
}

type PromiseCallback = () => Promise<Context | undefined>;

// @todo: ask
// @todo: extends Queue
export class Terminal {
	#ctx: Context;
	#promises: Array<PromiseCallback>;

	constructor() {
		this.#ctx = {} as Context;
		this.#promises = [];
	}

	#enqueue(callback: PromiseCallback) {
		this.#promises.push(callback);
	}

	#dequeue() {
		return this.#promises.shift();
	}

	ask({ skip, ...restParams }: AskPluginParams & ArgsLifecycle): Terminal {
		const plugin = new AskPlugin(restParams);

		args.option(restParams.key, "TODO");

		this.#enqueue(() => {
			if (skip?.(this.#ctx)) {
				return Promise.resolve(undefined);
			}

			return plugin.execute();
		});

		return this;
	}

	command(
		params: {
			label: string;
			handler: (ctx: Context) => Promise<{ key: string; value: unknown }>;
		} & ArgsLifecycle
	): Terminal {
		const { label, handler, skip } = params;

		// console.log("command", label);
		this.#enqueue(async () => {
			if (skip?.(this.#ctx)) {
				return Promise.resolve(undefined);
			}

			const { key, value } = await handler(this.#ctx);

			return { [key]: value };
		});

		return this;
	}

	start() {
		args.parse(process.argv);
		this.#run();

		return function stop() {
			console.log("plop");
		};
	}

	async #run() {
		let promise: PromiseCallback | undefined;

		while ((promise = this.#dequeue())) {
			const value = await promise();

			for (const key in value) {
				this.#ctx[key] = value[key];
			}
		}

		console.info("\nResult (context): ", this.#ctx);
	}

	// exit() {} // graceful shutdown
}

const terminal = new Terminal();

terminal
	.ask({
		key: "question1",
		label: "What is your single choice?",
		type: "select:single",
		choices: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption1",
		skip() {
			return false;
		},
	})
	.ask({
		key: "question2",
		label: "What is your multiple choices?",
		type: "select:multiple",
		choices: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
		skip(ctx) {
			return ctx.question1 !== "singleOption2";
		},
	})
	.ask({
		key: "question3", // @todo: support alias via array ["question3", "q3"]
		type: "confirm",
		// @todo: add description for help
		// @todo: auto skip if the parsed arg flag are filled
		label: "What is your confirm input?",
		defaultValue: true,
		skip() {
			return false;
		},
	})
	.ask({
		key: "question4",
		label: "What is your text input?",
		defaultValue: "bypass next command",
		skip(ctx) {
			return ctx.question3 as boolean;
		},
	})
	.command({
		label: "Checking git status",
		async handler(ctx) {
			return { key: "question5", value: new Set(["plop"]) };
		},
		skip(ctx) {
			return ctx.question4 === "bypass next command";
		},
	})
	.start();
