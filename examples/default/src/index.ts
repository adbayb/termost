import { helpers, termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
	sharedOutput: string;
};

const program = termost<ProgramContext>({
	description:
		"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
	name: package_.name,
	onException(error) {
		console.log(
			"`onException` catches `uncaughtException` and `unhandledRejection`",
			error,
		);
	},
	onShutdown() {
		console.log(
			"`onShutdown` catches `SIGINT` and `SIGTERM` OS signals (useful, for example, to release resources before interrupting the process)",
		);
	},
	version: package_.version,
});

program
	.option({
		defaultValue: "Default value",
		description: "A super useful CLI flag",
		key: "option",
		name: { long: "flag", short: "f" },
	})
	.task({
		async handler() {
			return helpers.exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
		key: "sharedOutput",
		label: "Retrieves files",
	})
	.task({
		handler(context) {
			helpers.message(`Task value: ${context.sharedOutput}`);
			helpers.message(`Option value: ${context.option}`, {
				type: "warning",
			});
		},
	});
