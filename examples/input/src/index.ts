import { helpers, termost } from "termost";

type ProgramContext = {
	input1: "singleOption1" | "singleOption2";
	input2: ("multipleOption1" | "multipleOption2")[];
	input3: boolean;
	input4: string;
};

const program = termost<ProgramContext>("Example to showcase the `input` API");

program
	.input({
		key: "input1",
		label: "What is your single choice?",
		defaultValue: "singleOption2",
		options: ["singleOption1", "singleOption2"],
		type: "select",
	})
	.input({
		key: "input2",
		label: "What is your multiple choices?",
		defaultValue: ["multipleOption2"],
		options: ["multipleOption1", "multipleOption2"],
		type: "multiselect",
	})
	.input({
		key: "input3",
		label: "Are you sure to skip next input?",
		defaultValue: false,
		type: "confirm",
	})
	.input({
		key: "input4",
		label: (context) =>
			`Dynamic input label generated from a contextual value: ${context.input1}`,
		defaultValue: "Empty input",
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
