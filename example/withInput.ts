import { helpers, termost } from "../src";

type ProgramContext = {
	input1: "singleOption1" | "singleOption2";
	input2: Array<"multipleOption1" | "multipleOption2">;
	input3: boolean;
	input4: string;
};

const program = termost<ProgramContext>("Example to showcase the `input` API");

program
	.input({
		type: "select",
		key: "input1",
		label: "What is your single choice?",
		options: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption2",
	})
	.input({
		type: "multiselect",
		key: "input2",
		label: "What is your multiple choices?",
		options: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
	})
	.input({
		type: "confirm",
		key: "input3",
		label: "Are you sure to skip next input?",
		defaultValue: false,
	})
	.input({
		type: "text",
		key: "input4",
		label: (context) =>
			`Dynamic input label generated from a contextual value: ${context.input1}`,
		defaultValue: "Empty input",
		skip(context, argv) {
			console.log(argv);

			return Boolean(context.input3);
		},
	})
	.output({
		handler(context) {
			helpers.print(JSON.stringify(context, null, 4));
		},
	});
