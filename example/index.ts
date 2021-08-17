import { termost } from "../src";

// @todo: add function to generate label with values for `question` and `task` api
// @todo: rename ContextValues to Context and add other context values (such as currentCommand)
// @todo: README documentation
// @todo: add alias for help and version option

const program = termost(
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
	.task({
		key: "ls",
		label: "Retrieves files",
		async handler(_, helpers) {
			return await helpers.exec("ls -al", {
				cwd: process.cwd(),
			});
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(values.ls);
		},
	});
