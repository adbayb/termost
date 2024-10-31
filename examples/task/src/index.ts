import { helpers, termost } from "termost";

type ProgramContext = {
	computedFromOtherTaskValues: "big" | "small";
	execOutput: string;
	size: number;
};

const program = termost<ProgramContext>("Example to showcase the `task` API");

program
	.task({
		key: "size",
		label: "Task with returned value (persisted)",
		handler() {
			return 45;
		},
	})
	.task({
		label: "Task with side-effect only (no persisted value)",
		async handler() {
			// @note: side-effect only handler
			await wait(500);
		},
	})
	.task({
		key: "computedFromOtherTaskValues",
		label: "Task can also access other persisted task values",
		async handler(context) {
			if (context.size > 2000) {
				return Promise.resolve("big" as const);
			}

			return Promise.resolve("small" as const);
		},
	})
	.task({
		key: "execOutput",
		label: "Or even execute external commands thanks to its provided helpers",
		async handler() {
			return helpers.exec("echo 'Hello from shell'");
		},
	})
	.task({
		label: "A task can be skipped as well",
		async handler() {
			await wait(2000);
		},
		skip(context) {
			const needOptimization = context.size > 2000;

			return !needOptimization;
		},
	})
	.task({
		label: (context) =>
			`A task can have a dynamic label generated from contextual values: ${context.computedFromOtherTaskValues}`,
		handler() {
			return;
		},
	})
	.task({
		handler(context) {
			helpers.message(
				`If you don't specify a label, the handler is executed in "live mode" (the output is not hidden by the label and is displayed gradually).`,
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
