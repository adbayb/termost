import { createLogger, exec, termost } from "termost";
import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
	sharedOutput: string;
};

const logger = createLogger();

const program = termost<ProgramContext>({
	name: package_.name,
	description:
		"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
	onException(error) {
		console.log("`onException` catches `uncaughtException` and `unhandledRejection`", error);
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
		key: "option",
		name: { long: "flag", short: "f" },
		description: "A super useful CLI flag",
		defaultValue: "Default value",
	})
	.task({
		key: "sharedOutput",
		label: "Retrieves files",
		async handler() {
			return exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
	})
	.task({
		handler(context) {
			logger.info(`Task value: ${context.sharedOutput}`);
			logger.warn(`Option value: ${context.option}`);
		},
	});
