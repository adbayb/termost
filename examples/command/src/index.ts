import { helpers, termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	globalFlag: boolean;
};

const program = termost<ProgramContext>({
	description: "Example to showcase the `command` API",
	name: package_.name,
	version: package_.version,
});

program.option({
	defaultValue: false,
	description: "Shared flag between commands",
	key: "globalFlag",
	name: "global",
});

type BuildCommandContext = {
	localFlag: string;
};

program
	.command<BuildCommandContext>({
		description: "Transpile and bundle in production mode",
		name: "build",
	})
	.option({
		defaultValue: "local-value",
		description: "Local command flag",
		key: "localFlag",
		name: "local",
	})
	.task({
		handler(context, argv) {
			const { globalFlag, localFlag } = context;

			helpers.message(`👋 Hello, I'm the ${argv.command} command`, {
				lineBreak: { end: true, start: false },
			});
			helpers.message(`👉 Shared global flag = ${globalFlag}`, {
				label: false,
			});
			helpers.message(`👉 Local command flag = ${localFlag}`, {
				lineBreak: true,
			});
			helpers.message(`👉 Context value = ${JSON.stringify(context)}`, {
				lineBreak: { end: true, start: true },
			});
			helpers.message(`👉 Argv value = ${JSON.stringify(argv)}`);
		},
	});

program
	.command({
		description: "Rebuild your assets on any code change",
		name: "watch",
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
