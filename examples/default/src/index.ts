import { helpers, termost } from "termost";

type ProgramContext = {
	option: string;
	sharedOutput: string;
};

const program = termost<ProgramContext>(
	"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
	{
		onException(error) {
			console.log(
				"Catches `uncaughtException` and `unhandledRejection` events",
				error,
			);
		},
		onShutdown() {
			console.log(
				"Catches `SIGINT` and `SIGTERM` OS signals (useful, for example, to release resources before interrupting the process)",
			);
		},
	},
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
