import { termost } from "../src";

type ProgramContext = {
	question1: Array<"singleOption1">;
	question2: Array<"multipleOption1">;
	question3: boolean;
	question4: string;
	question5: string;
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
		label: "I can skip the next question. Are you sure to skip the next question?",
		defaultValue: false,
	})
	.question({
		type: "text",
		key: "question4",
		label: (values) =>
			`Are you sure to skip this question? ${values.question4}`,
		defaultValue: "bypass next command",
		skip(values) {
			return Boolean(values.question3);
		},
	})
	.question({
		type: "text",
		key: "question5",
		label: (values) =>
			`Dynamic question label generated from a context value: ${values.question1}`,
	})
	.message({
		handler(values, helpers) {
			helpers.print(JSON.stringify(values, null, 4));
		},
	});
