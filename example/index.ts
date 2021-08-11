import termost from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

const program = termost("Quickly bundle your library");

// **@todo: main program name and version display (automaticly from package metavalues)**
// @todo: review key vs name + key requirements (such as in question)
// @todo: clean others todos

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
		skip(values) {
			return values.question1 !== "singleOption2";
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
		skip(values) {
			return Boolean(values.question3);
		},
	})
	.option({
		name: "myFlag",
		description: "Useful CLI flag",
		defaultValue: 2,
	})
	.task({
		label: "Checking git status",
		async handler() {
			await wait(2000);

			return new Set(["plop"]);
		},
		skip(values) {
			return values.question4 === "bypass next command";
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
		handler(values, helpers) {
			const size: number = values.size;

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
		name: { long: "shortOption", short: "s" },
		description: "Useful CLI flag",
		defaultValue: 0,
	})
	.option({
		key: "optionWithoutAlias",
		name: "longOption",
		description: "Useful CLI flag",
		defaultValue: 1,
	})
	.task({
		key: "ls",
		label: "Retrieves files",
		async handler(_, helpers) {
			await wait(1000);

			return await helpers.exec("ls -al", {
				cwd: process.cwd(),
			});
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(values.ls);
			console.log("values", values);
		},
	});
