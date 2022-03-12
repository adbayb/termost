import { termost } from "../src";

type ProgramContext = {
	sharedFlag: boolean;
};

const program = termost<ProgramContext>(
	"Example to showcase the `command` API"
);

// @todo to fix
program.option({
	key: "sharedFlag",
	name: "no-check",
	description: "Shared flag between commands",
	defaultValue: true,
});

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.message({
		handler(context, helpers) {
			helpers.print(
				`👋 Hello, I'm the ${context.args.command} command\nShared flag = ${context.values.sharedFlag}`
			);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(context, helpers) {
			helpers.print(
				`👋 Hello, I'm the ${context.args.command} command\nShared flag = ${context.values.sharedFlag}`,
				{
					type: "warning",
				}
			);
		},
	});
