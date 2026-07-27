import { termost } from "termost";
import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	input: string;
	option: string;
	task: string;
};

const program = termost<ProgramContext>({
	name: package_.name,
	description: "Example to showcase the `option` API",
	version: package_.version,
});

program
	.option({
		key: "option",
		name: { long: "option", short: "o" },
		description: "An option",
		validate({ option }) {
			if (option === "error") {
				return new Error("Invalid option->input");
			}

			return undefined;
		},
	})
	.task({
		key: "task",
		handler() {
			return "error";
		},
		validate({ task }) {
			if (task === "error") {
				return new Error("Invalid task->input");
			}

			return undefined;
		},
	});
