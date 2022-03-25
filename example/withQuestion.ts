import { helpers, termost } from "../src";

type ProgramContext = {
	question1: "singleOption1" | "singleOption2";
	question2: Array<"multipleOption1" | "multipleOption2">;
	question3: boolean;
	question4: string;
};

const program = termost<ProgramContext>(
	"Example to showcase the `question` API"
);

program
	.question({
		type: "select",
		key: "question1",
		label: "What is your single choice?",
		options: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption2",
	})
	.question({
		type: "multiselect",
		key: "question2",
		label: "What is your multiple choices?",
		options: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
	})
	.question({
		type: "confirm",
		key: "question3",
		label: "Are you sure to skip next question?",
		defaultValue: false,
	})
	.question({
		type: "text",
		key: "question4",
		label: (context) =>
			`Dynamic question label generated from a contextual value: ${context.values.question1}`,
		defaultValue: "Empty input",
		skip(context) {
			return Boolean(context.values.question3);
		},
	})
	.message({
		handler(context) {
			helpers.print(JSON.stringify(context.values, null, 4));
		},
	});
