import { helpers, termost } from "../src";

type ProgramContext = {
	sharedOutput: string;
	option: string;
};

const program = termost<ProgramContext>(
	"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
	{
		onShutdown() {
			console.log(
				"Catches `SIGINT` and `SIGTERM` OS signals (useful, for example, to release resources before interrupting the process)"
			);
		},
		onException(error) {
			console.log(
				"Catches `uncaughtException` and `unhandledRejection` events",
				error
			);
		},
	}
);

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
			return await helpers.exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
	})
	.output({
		handler(context) {
			helpers.print(`Task value: ${context.sharedOutput}`);
			helpers.print(`Option value: ${context.option}`, {
				type: "warning",
			});
		},
	});
