import { termost } from "termost";

type ProgramContext = {
	option: string;
};

const program = termost<ProgramContext>(
	"Example to showcase empty `command` fallback",
);

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
