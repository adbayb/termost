import termost from "../src";

const program = termost("Example to showcase the `option` API");

program
	.option({
		key: "optionWithAlias",
		name: { long: "shortOption", short: "s" },
		description: "Useful CLI flag",
		defaultValue: 0,
	})
	.option({
		key: "optionWithoutAlias",
		name: "longOption",
		description: "Useful CLI flag",
		defaultValue: 1,
	})
	.message({
		handler(values, helpers) {
			helpers.print(JSON.stringify(values, null, 2));
		},
	});
