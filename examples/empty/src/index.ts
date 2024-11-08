import { termost } from "termost";

import { name, version } from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
};

const program = termost<ProgramContext>({
	name,
	description: "Example to showcase empty `command` fallback",
	version,
});

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.option({
		key: "option",
		name: "longOption",
		description: "Useful CLI flag",
		defaultValue: "defaultValue",
	});

program.command({
	name: "watch",
	description: "Rebuild your assets on any code change",
});
