import { helpers, termost } from "../src";

type ProgramContext = {
	output: string;
};

const program = termost<ProgramContext>(
	"Example to showcase the `message` API"
);

program
	.output({
		handler() {
			const content =
				"A content formatted thanks to the `print` helper presets.";

			helpers.message(content);
			helpers.message(content, { type: "warning" });
			helpers.message(content, { type: "error" });
			helpers.message(content, { type: "success" });
			helpers.message(content, {
				type: "information",
				label: "👋 You can also customize the label",
			});
			helpers.message(
				["I support also", "multilines", "with array input"],
				{
					type: "information",
					label: "👋 You can also customize the label",
				}
			);
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
	})
	.output({
		key: "output",
		handler() {
			return "Hello from previous output";
		},
	})
	.output({
		handler(context) {
			helpers.message(
				`A shareable value can also be displayed: ${context.output}`
			);
		},
	})
	.output({
		async handler() {
			helpers.message(
				"I can also run asynchronous operations... Operation is starting..."
			);

			await wait(2000);

			helpers.message("Operation is finished");
		},
	});

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};
