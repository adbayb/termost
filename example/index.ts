import termost from "../src";

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
