import { helpers, termost } from "termost";

import { name, version } from "../package.json" with { type: "json" };

type ProgramContext = {
	globalFlag: boolean;
};

const program = termost<ProgramContext>({
	name,
	description: "Example to showcase the `command` API",
	version,
});

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
	.task({
		handler(context, argv) {
			const { globalFlag, localFlag } = context;

			helpers.message(`👋 Hello, I'm the ${argv.command} command`);
			helpers.message(`👉 Shared global flag = ${globalFlag}`);
			helpers.message(`👉 Local command flag = ${localFlag}`);
			helpers.message(`👉 Context value = ${JSON.stringify(context)}`);
			helpers.message(`👉 Argv value = ${JSON.stringify(argv)}`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.task({
		handler(context, argv) {
			const { globalFlag } = context;

			helpers.message(`👋 Hello, I'm the ${argv.command} command`);
			helpers.message(`👉 Shared global flag = ${globalFlag}`);
			helpers.message(`👉 Context value = ${JSON.stringify(context)}`);
			helpers.message(`👉 Argv value = ${JSON.stringify(argv)}`);
		},
	});
