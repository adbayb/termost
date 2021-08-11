import termost from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

const program = termost("Quickly bundle your library");

// **@todo: version display (automatic from package metadata)**
// @todo: clean others todos
// @todo: add exec helpers to task() and remove system export
// @todo: rename context to data?

program
	.command({
		name: "interact",
		description: "Interactive example",
	})
	.question({
		type: "select:one",
		key: "question1",
		label: "What is your single choice?",
		choices: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption1",
	})
	.question({
		type: "select:many",
		key: "question2",
		label: "What is your multiple choices?",
		choices: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
		skip(data) {
			return data.question1 !== "singleOption2";
		},
	})
	.question({
		type: "confirm",
		key: "question3",
		label: "What is your confirm question?",
		defaultValue: true,
	})
	.question({
		type: "text",
		key: "question4",
		label: "What is your text question?",
		defaultValue: "bypass next command",
		skip(data) {
			return Boolean(data.question3);
		},
	})
	.option({
		name: "myFlag",
		description: "Useful CLI flag",
		defaultValue: 2,
	})
	.task({
		label: "Checking git status",
		async handler(/*data*/) {
			await wait(2000);

			return new Set(["plop"]);
		},
		skip(data) {
			return data.question4 === "bypass next command";
		},
	})
	.task({
		label: "Another long running tasks",
		async handler() {
			await wait(1000);

			return "another";
		},
	});

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.task({
		label: "Building esm, cjs 👷‍♂️",
		async handler() {
			await wait(1000);
		},
	})
	.task({
		key: "size",
		label: "Calculating bundle size 📐",
		async handler() {
			await wait(1000);

			return 223434;
		},
	})
	.message({
		handler(helpers, data) {
			const size = data.size as number;

			helpers.print([
				"📦 main.js",
				`   ${String(size).padEnd(8)} B  raw`,
				`   ${String(size / 3).padEnd(8)} B  gzip`,
				"📦 other.js",
				`   ${String(size).padEnd(8)} B  raw`,
				`   ${String(size / 3).padEnd(8)} B  gzip`,
			]);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "warning" }
			);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "error" }
			);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "success", label: "Output sizes" }
			);

			console.log(
				helpers.format("Custom formatting", {
					color: "white",
					modifier: ["italic", "strikethrough"],
				})
			);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.task({
		label: `Watching 🔎 last at ${new Date().toLocaleTimeString()}`,
		async handler() {
			return await wait(1000);
		},
	});

program
	.option({
		key: "optionWithAlias",
		name: ["shortOption", "s"],
		description: "Useful CLI flag",
		defaultValue: 0,
	})
	.option({
		key: "optionWithoutAlias",
		name: "longOption",
		description: "Useful CLI flag",
		defaultValue: 1,
	})
	.message({
		handler(_, data) {
			console.log("plop", data);
		},
	});
