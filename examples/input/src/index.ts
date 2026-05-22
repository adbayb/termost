import { helpers, termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	input1: "singleOption1" | "singleOption2";
	input2: ("multipleOption1" | "multipleOption2")[];
	input3: boolean;
	input4: string;
};

const program = termost<ProgramContext>({
	description: "Example to showcase the `input` API",
	name: package_.name,
	version: package_.version,
});

program
	.input({
		defaultValue: "singleOption2",
		key: "input1",
		label: "What is your single choice?",
		options: ["singleOption1", "singleOption2"],
		type: "select",
	})
	.input({
		defaultValue: ["multipleOption2"],
		key: "input2",
		label: "What is your multiple choices?",
		options: ["multipleOption1", "multipleOption2"],
		type: "multiselect",
	})
	.input({
		defaultValue: false,
		key: "input3",
		label: "Are you sure to skip next input?",
		type: "confirm",
	})
	.input({
		defaultValue: "Empty input",
		key: "input4",
		label: (context) =>
			`Dynamic input label generated from a contextual value: ${context.input1}`,
		skip(context, argv) {
			console.log(argv);

			return Boolean(context.input3);
		},
		type: "text",
	})
	.task({
		handler(context) {
			helpers.message(JSON.stringify(context, null, 4));
		},
	});
