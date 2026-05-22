import { helpers, termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	computedFromOtherTaskValues: "big" | "small";
	execOutput: string;
	size: number;
};

const program = termost<ProgramContext>({
	description: "Example to showcase the `task` API",
	name: package_.name,
	version: package_.version,
});

program
	.task({
		handler() {
			return 45;
		},
		key: "size",
		label: "Task with returned value (persisted)",
	})
	.task({
		async handler() {
			// @note: side-effect only handler
			await wait(500);
		},
		label: "Task with side-effect only (no persisted value)",
	})
	.task({
		handler(context) {
			if (context.size > 2000) {
				return "big" as const;
			}

			return "small" as const;
		},
		key: "computedFromOtherTaskValues",
		label: "Task can also access other persisted task values",
		validate({ computedFromOtherTaskValues }) {
			if (computedFromOtherTaskValues === "big")
				return new Error("Invalid input");

			return undefined;
		},
	})
	.task({
		async handler() {
			return helpers.exec("echo 'Hello from shell'");
		},
		key: "execOutput",
		label: "Or even execute external commands thanks to its provided helpers",
	})
	.task({
		async handler() {
			await wait(2000);
		},
		label: "A task can be skipped as well",
		skip(context) {
			const needOptimization = context.size > 2000;

			return !needOptimization;
		},
	})
	.task({
		handler() {
			return;
		},
		label: (context) =>
			`A task can have a dynamic label generated from contextual values: ${context.computedFromOtherTaskValues}`,
	})
	.task({
		handler(context) {
			helpers.message(
				'If you don\'t specify a label, the handler is executed in "live mode" (the output is not hidden by the label and is displayed gradually).',
				{ label: "Label & console output" },
			);

			helpers.message(
				`A task with a specified "key" can be retrieved here. Size = ${context.size}. If no "key" was specified the task returned value cannot be persisted across program instructions.`,
				{ label: "Context management" },
			);
		},
	})
	.task({
		handler(context) {
			const content =
				"The `message` helpers can be used to display task content in a nice way";

			helpers.message(content, {
				label: "Output formatting",
			});
			helpers.message(content, { type: "warning" });
			helpers.message(content, { type: "error" });
			helpers.message(content, { type: "success" });
			helpers.message(content, {
				label: "👋 You can also customize the label",
				type: "information",
			});
			console.log(
				helpers.format(
					"\nYou can also have a total control on the formatting through the `format` helper.",
					{
						color: "white",
						modifiers: ["italic", "strikethrough", "bold"],
					},
				),
			);

			console.info(JSON.stringify(context, null, 2));
		},
	});

const wait = async (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};
