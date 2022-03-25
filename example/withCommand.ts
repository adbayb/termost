import { helpers, termost } from "../src";

type ProgramContext = {
	globalFlag: boolean;
};

const program = termost<ProgramContext>(
	"Example to showcase the `command` API"
);

program.option({
	key: "globalFlag",
	name: "global",
	description: "Shared flag between commands",
	defaultValue: false,
});

interface BuildCommandContext {
	localFlag: string;
}

program
	.command<BuildCommandContext>({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.option({
		key: "localFlag",
		name: "local",
		description: "Local command flag",
		defaultValue: "local-value",
	})
	.message({
		handler(context, argv) {
			helpers.print(`👋 Hello, I'm the ${argv.command} command`);

			const { localFlag, globalFlag } = context.values;

			helpers.print(`👉 Shared global flag = ${globalFlag}`);
			helpers.print(`👉 Local command flag = ${localFlag}`);
			helpers.print(`👉 Context value = ${JSON.stringify(context)}`);
			helpers.print(`👉 Argv value = ${JSON.stringify(argv)}`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(context, argv) {
			helpers.print(`👋 Hello, I'm the ${argv.command} command`);

			const { globalFlag } = context.values;

			helpers.print(`👉 Shared global flag = ${globalFlag}`);
			helpers.print(`👉 Context value = ${JSON.stringify(context)}`);
			helpers.print(`👉 Argv value = ${JSON.stringify(argv)}`);
		},
	});
