import { createLogger, termost } from "termost";
import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	globalFlag: boolean;
};

const buildLogger = createLogger({ name: "command:build" });
const watchLogger = createLogger({ name: "command:watch" });

const program = termost<ProgramContext>({
	name: package_.name,
	description: "Example to showcase the `command` API",
	version: package_.version,
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

			buildLogger.info(`👋 Hello, I'm the ${argv.command} command`);
			buildLogger.info(`👉 Shared global flag = ${globalFlag}`, { globalFlag });
			buildLogger.info(`👉 Local command flag = ${localFlag}`, { localFlag });
			buildLogger.info(`👉 Context value = ${JSON.stringify(context)}`, context);
			buildLogger.info(`👉 Argv value = ${JSON.stringify(argv)}`, argv);
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

			watchLogger.info(`👋 Hello, I'm the ${argv.command} command`);
			watchLogger.info(`👉 Shared global flag = ${globalFlag}`, { globalFlag });
			watchLogger.info(`👉 Context value = ${JSON.stringify(context)}`, context);
			watchLogger.info(`👉 Argv value = ${JSON.stringify(argv)}`, argv);
		},
	});
