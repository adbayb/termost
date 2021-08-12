import termost from "../src";

const program = termost("Example to showcase `question` API");

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
		skip(values) {
			return values.question1 !== "singleOption2";
		},
	})
	.question({
		type: "confirm",
		key: "question3",
		label: "What is your confirm question?",
		defaultValue: true,
	})
	.question({
		type: "text",
		key: "question4",
		label: "What is your text question?",
		defaultValue: "bypass next command",
		skip(values) {
			return Boolean(values.question3);
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(JSON.stringify(values, null, 2));
		},
	});
