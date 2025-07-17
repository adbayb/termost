import { termost } from "termost";

import { name, version } from "../package.json" with { type: "json" };

type ProgramContext = {
	input: string;
	option: string;
	task: string;
};

const program = termost<ProgramContext>({
	name,
	description: "Example to showcase the `option` API",
	version,
});

program
	.option({
		key: "option",
		name: { long: "option", short: "o" },
		description: "An option",
		validate({ option }) {
			if (option === "error") return new Error("Invalid option->input");

			return undefined;
		},
	})
	.task({
		key: "task",
		handler() {
			return "error";
		},
		validate({ task }) {
			if (task === "error") return new Error("Invalid task->input");

			return undefined;
		},
	});
