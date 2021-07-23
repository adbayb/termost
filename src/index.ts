import { terminal } from "./terminal";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

terminal
	.command("hello")
	.question({
		type: "select:one",
		key: "question1",
		label: "What is your single choice?",
		choices: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption1",
		skip() {
			return false;
		},
	})
	.question({
		type: "select:many",
		key: "question2",
		label: "What is your multiple choices?",
		choices: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
		skip(context) {
			return context.question1 !== "singleOption2";
		},
	})
	.question({
		type: "confirm",
		key: "question3", // @todo: support alias via array ["question3", "q3"]
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
		key: "question4",
		label: "What is your text question?",
		defaultValue: "bypass next command",
		skip(context) {
			return context.question3 as boolean;
		},
	})
	.option({
		type: "flag",
		key: "myFlag",
		description: "Useful CLI flag",
		defaultValue: 2,
	})
	.option({
		type: "argument",
		key: "myArg",
		description: "Useful CLI arg",
		defaultValue: "./index.ts",
	})
	.task({
		key: "gitstatus",
		label: "Checking git status",
		async handler(/*context*/) {
			console.log("Before");
			await wait(5000);
			console.log("After");

			return { key: "question5", value: new Set(["plop"]) };
		},
		skip(context) {
			return context.question4 === "bypass next command";
		},
	})
	.question({
		type: "text",
		key: "question4",
		label: "What is your text question?",
		defaultValue: "bypass next command",
		skip(context) {
			return context.question3 as boolean;
		},
	})
	.run();

// cleanup();

/*
import args from "args";
// @todo: custom implementation for listr!
import Listr from "listr";

const wait = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

const tasks = new Listr([
	{
		title: "Git",
		task: () => {
			return new Listr(
				[
					{
						title: "Checking git status",
						task: () => wait(5000),
					},
					{
						title: "Checking remote history",
						task: () => Promise.resolve("success"),
					},
				],
				{ concurrent: true }
			);
		},
	},
	{
		title: "Install package dependencies with Yarn",
		task: (ctx, task) => wait(2000),
	},
]);

args.example("args command -d", "Run the args command with the option -d")
	.option(["p", "port"], "The port on which the app will be running", 3000)
	.option("reload", "Enable/disable livereloading")
	.command(
		"serve",
		"Serve your static site",
		() => {
			console.log("run command");
		},
		["s"]
	);

const flags = args.parse(process.argv);

console.log(flags);

// tasks.run().catch((err) => {
// 	console.error(err);
// });

*/
