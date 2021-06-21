import inquirer from "inquirer";
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

args.option(["p", "port"], "The port on which the app will be running", 3000)
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

inquirer
	.prompt([
		{
			name: "faveReptile",
			message: "What is your favorite reptile?",
		},
	])
	.then((answers) => {
		console.info("Answer:", answers.faveReptile);
	})
	.then(() => {
		return tasks.run().catch((err) => {
			console.error(err);
		});
	});
