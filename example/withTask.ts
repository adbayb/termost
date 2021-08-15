import { termost } from "../src";

type ProgramContext = {
	computedFromOtherTaskValues: "big" | "small";
	execOutput: string;
	size: number;
};

const program = termost<ProgramContext>("Example to showcase the `task` API");

program
	.task({
		key: "size",
		label: "Task with forwardable value",
		async handler() {
			return 45;
		},
	})
	.task({
		label: "Task with not persisted value",
		handler() {},
	})
	.task({
		key: "computedFromOtherTaskValues",
		label: "Task can also access other persisted task values",
		handler(values) {
			if (values.size > 2000) {
				return Promise.resolve("big");
			}

			return Promise.resolve("small");
		},
	})
	.task({
		key: "execOutput",
		label: "Or even execute external commands thanks to its provided helpers",
		handler(values, helpers) {
			return helpers.exec("ls -al");
		},
	})
	.task({
		label: "A task can be skipped as well",
		async handler() {
			await wait(2000);

			return Promise.resolve("Super long task");
		},
		skip(values) {
			const needOptimization = values.size > 2000;

			return !needOptimization;
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(
				`A task with a specified "key" can be retrieved here. Size = ${values.size}. If no "key" was specified the task returned value cannot be persisted across program instructions.`
			);

			console.info(JSON.stringify(values, null, 2));
		},
	});

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};
