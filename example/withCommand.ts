import { termost } from "../src";

const program = termost("Example to showcase the `command` API");

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.message({
		handler(context, helpers) {
			helpers.print(`👋 Hello, I'm the ${context.args.command} command`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(context, helpers) {
			helpers.print(`👋 Hello, I'm the ${context.args.command} command`, {
				type: "warning",
			});
		},
	});
