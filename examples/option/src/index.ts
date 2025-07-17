import { helpers, termost } from "termost";

import { name, version } from "../package.json" with { type: "json" };

type ProgramContext = {
	optionWithAlias: number;
	optionWithoutAlias: string;
};

const program = termost<ProgramContext>({
	name,
	description: "Example to showcase the `option` API",
	version,
});

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
		defaultValue: "defaultValue",
		validate({ optionWithoutAlias }) {
			if (["error", "invalid"].includes(optionWithoutAlias))
				return new Error("Invalid input");

			return undefined;
		},
	})
	.task({
		handler(context) {
			helpers.message(JSON.stringify(context, null, 2));
		},
	});
