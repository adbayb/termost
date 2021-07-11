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
