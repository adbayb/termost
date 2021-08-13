import { termost } from "../src";

const program = termost("Example to showcase the `message` API");

program.message({
	handler(values, helpers) {
		const content =
			"A content formatted thanks to the `print` helper presets.";

		helpers.print(content);
		helpers.print(content, { type: "warning" });
		helpers.print(content, { type: "error" });
		helpers.print(content, { type: "success" });
		helpers.print(content, {
			type: "information",
			label: "👋 You can also customize the label",
		});
		helpers.print(["I support also", "multilines", "with array input"], {
			type: "information",
			label: "👋 You can also customize the label",
		});
		console.log(
			helpers.format(
				"\nYou can also have a total control on the formatting through the `format` helper.",
				{
					color: "white",
					modifier: ["italic", "strikethrough", "bold"],
				}
			)
		);
	},
});
