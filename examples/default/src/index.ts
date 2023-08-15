import { helpers, termost } from "termost";

type ProgramContext = {
	sharedOutput: string;
	option: string;
};

const program = termost<ProgramContext>(
	"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form.",
	{
		onShutdown() {
			console.log(
				"Catches `SIGINT` and `SIGTERM` OS signals (useful, for example, to release resources before interrupting the process)",
			);
		},
		onException(error) {
			console.log(
				"Catches `uncaughtException` and `unhandledRejection` events",
				error,
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
		label: "Retrieves files",
		handler() {
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
