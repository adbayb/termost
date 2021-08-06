import { terminal } from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

terminal
	.command({
		name: "hello",
		description: "Generate an hello world message",
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

terminal.program("Quickly bundle your library").task({
	name: "git",
	label: "Checking git status",
	async handler() {
		await wait(3000);

		return new Set(["plop"]);
	},
});

terminal.command({ name: "tyty", description: "aie aie" }).option({
	name: "toto",
	description: "Useful CLI titi flag",
	defaultValue: 40,
});
