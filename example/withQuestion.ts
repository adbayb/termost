import { termost } from "../src";

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
		type: "select:one",
		key: "question1",
		label: "What is your single choice?",
		choices: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption1",
	})
	.question({
		type: "select:many",
		key: "question2",
		label: "What is your multiple choices?",
		choices: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
	})
	.question({
		type: "confirm",
		key: "question3",
		label: "Are you sure to skip this question?",
		defaultValue: false,
		skip(context) {
			return Boolean(context.values.question3);
		},
	})
	.question({
		type: "text",
		key: "question4",
		label: (context) =>
			`Dynamic question label generated from a context value: ${context.values.question1}`,
	})
	.message({
		handler(context, helpers) {
			helpers.print(JSON.stringify(context, null, 4));
		},
	});
