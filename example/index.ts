import { terminal } from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

// @todo: version display
// @todo: supports aliased option (use minimist?)
// @todo: clean others todos

terminal
	.command({
		name: "interact",
		description: "Interactive example",
	})
	.question({
		type: "select:one",
		name: "question1",
		label: "What is your single choice?",
		choices: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption1",
		skip() {
			return false;
		},
	})
	.question({
		type: "select:many",
		name: "question2",
		label: "What is your multiple choices?",
		choices: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
		skip(context) {
			return context.question1 !== "singleOption2";
		},
	})
	.question({
		type: "confirm",
		name: "question3", // @todo: support alias via array ["question3", "q3"]
		// @todo: add description for help
		// @todo: auto skip if the parsed arg flag are filled
		label: "What is your confirm question?",
		defaultValue: true,
		skip() {
			return false;
		},
	})
	.question({
		type: "text",
		name: "question4",
		label: "What is your text question?",
		defaultValue: "bypass next command",
		skip(context) {
			return context.question3 as boolean;
		},
	})
	.option({
		name: "myFlag",
		description: "Useful CLI flag",
		defaultValue: 2,
	})
	.task({
		name: "question5",
		label: "Checking git status",
		async handler(/*context*/) {
			await wait(2000);

			return new Set(["plop"]);
		},
		skip(context) {
			return context.question4 === "bypass next command";
		},
	})
	.task({
		name: "question6",
		label: "Another long running tasks",
		async handler(context) {
			await wait(1000);

			console.log("Result = ", context);

			return "another";
		},
	});

terminal.program("Quickly bundle your library");

terminal
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	// @todo: make `name` optional and fill ctx only if name is specified consumer side
	// @todo: rename name as key
	.task({
		name: "transpile",
		label: "Building esm, cjs 👷‍♂️",
		async handler() {
			await wait(1000);
		},
	})
	.task({
		name: "size",
		label: "Calculating bundle size 📐",
		async handler() {
			await wait(1000);

			// @fix: display glitch (output API?)
			console.log(
				`\n📦 main.js\n${String(223434).padStart(11)} B  raw\n${String(
					56789
				).padStart(11)} B gzip\n`
			);
		},
	});

terminal
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.task({
		name: "transpile",
		label: `Watching 🔎 last at ${new Date().toLocaleTimeString()}`,
		async handler() {
			return await wait(1000);
		},
	});
