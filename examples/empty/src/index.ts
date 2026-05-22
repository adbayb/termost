import { termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
};

const program = termost<ProgramContext>({
	description: "Example to showcase empty `command` fallback",
	name: package_.name,
	version: package_.version,
});

program
	.command({
		description: "Transpile and bundle in production mode",
		name: "build",
	})
	.option({
		defaultValue: "defaultValue",
		description: "Useful CLI flag",
		key: "option",
		name: "longOption",
	});

program.command({
	description: "Rebuild your assets on any code change",
	name: "watch",
});
