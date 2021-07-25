import { terminal } from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

// @todo: help command
// @todo: toolbox (helpers such as exec)

terminal
	.command("hello", "Generate an hello world message")
	// .question({
	// 	type: "select:one",
	// 	key: "question1",
	// 	label: "What is your single choice?",
	// 	choices: ["singleOption1", "singleOption2"],
	// 	defaultValue: "singleOption1",
	// 	skip() {
	// 		return false;
	// 	},
	// })
	// .question({
	// 	type: "select:many",
	// 	key: "question2",
	// 	label: "What is your multiple choices?",
	// 	choices: ["multipleOption1", "multipleOption2"],
	// 	defaultValue: ["multipleOption2"],
	// 	skip(context) {
	// 		return context.question1 !== "singleOption2";
	// 	},
	// })
	// .question({
	// 	type: "confirm",
	// 	key: "question3", // @todo: support alias via array ["question3", "q3"]
	// 	// @todo: add description for help
	// 	// @todo: auto skip if the parsed arg flag are filled
	// 	label: "What is your confirm question?",
	// 	defaultValue: true,
	// 	skip() {
	// 		return false;
	// 	},
	// })
	// .question({
	// 	type: "text",
	// 	key: "question4",
	// 	label: "What is your text question?",
	// 	defaultValue: "bypass next command",
	// 	skip(context) {
	// 		return context.question3 as boolean;
	// 	},
	// })
	.option({
		key: "myFlag",
		description: "Useful CLI flag",
		defaultValue: 2,
	})
	.task({
		key: "question5",
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
		key: "question6",
		label: "Another long running tasks",
		async handler(/*context*/) {
			await wait(1000);

			return "another";
		},
	})
	.run();

// cleanup();
