import { termost } from "../src";

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

type BuildCommandContext = {
	localFlag: string;
};

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
		handler(context, helpers) {
			helpers.print(`👋 Hello, I'm the ${context.command} command`);

			const { localFlag, globalFlag } = context.values;

			helpers.print(`👉 Shared global flag = ${globalFlag}`);
			helpers.print(`👉 Local command flag = ${localFlag}`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(context, helpers) {
			helpers.print(`👋 Hello, I'm the ${context.command} command`);

			const { globalFlag } = context.values;

			helpers.print(`👉 Shared global flag = ${globalFlag}`);
		},
	});
