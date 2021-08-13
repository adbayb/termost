import { termost } from "../src";

// @todo: setup() helper called inside termost to handle global error listeners?
// @todo: add function to generate label with values for `question` and `task` api
// @todo: typing for values `termost<{ ls: string }>()`

const program = termost(
	"Program description placeholder. Program name and version are retrieved from your `package.json`. You can override this automatic retrieval by using the `termost({ name, description, version })` builder form."
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
