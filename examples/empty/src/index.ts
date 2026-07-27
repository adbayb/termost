import { termost } from "termost";
import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	option: string;
};

const program = termost<ProgramContext>({
	name: package_.name,
	description: "Example to showcase empty `command` fallback",
	version: package_.version,
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
