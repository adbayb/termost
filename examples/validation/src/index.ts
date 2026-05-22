import { termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	input: string;
	option: string;
	task: string;
};

const program = termost<ProgramContext>({
	description: "Example to showcase the `option` API",
	name: package_.name,
	version: package_.version,
});

program
	.option({
		description: "An option",
		key: "option",
		name: { long: "option", short: "o" },
		validate({ option }) {
			if (option === "error") return new Error("Invalid option->input");

			return undefined;
		},
	})
	.task({
		handler() {
			return "error";
		},
		key: "task",
		validate({ task }) {
			if (task === "error") return new Error("Invalid task->input");

			return undefined;
		},
	});
