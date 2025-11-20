import { helpers, termost } from "termost";

import { name, version } from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
	sharedOutput: string;
};

const program = termost<ProgramContext>({
	name,
	description:
		"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
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
	version,
});

program
	.option({
		key: "option",
		name: { long: "flag", short: "f" },
		description: "A super useful CLI flag",
		defaultValue: "Default value",
	})
	.task({
		key: "sharedOutput",
		label: "Retrieves files",
		async handler() {
			return helpers.exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
	})
	.task({
		handler(context) {
			helpers.message(`Task value: ${context.sharedOutput}`);
			helpers.message(`Option value: ${context.option}`, {
				type: "warning",
			});
		},
	});
