import termost from "../src";

const program = termost("Example to showcase the `question` API");

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
		label: "I can be skipped. Are you sure to skip me?",
		defaultValue: "bypass next command",
		skip(values) {
			return Boolean(values.question3);
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(JSON.stringify(values, null, 4));
		},
	});
