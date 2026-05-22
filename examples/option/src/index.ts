import { helpers, termost } from "termost";

import package_ from "../package.json" with { type: "json" };

type ProgramContext = {
	optionWithAlias: number;
	optionWithoutAlias: string;
};

const program = termost<ProgramContext>({
	description: "Example to showcase the `option` API",
	name: package_.name,
	version: package_.version,
});

program
	.option({
		defaultValue: 0,
		description: "Useful CLI flag",
		key: "optionWithAlias",
		name: { long: "shortOption", short: "s" },
	})
	.option({
		defaultValue: "defaultValue",
		description: "Useful CLI flag",
		key: "optionWithoutAlias",
		name: "longOption",
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
