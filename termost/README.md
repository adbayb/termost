<br>
<div align="center">
    <h1>💻 Termost</h1>
    <strong>Get the most of your terminal</strong>
</div>
<br>
<br>

## ✨ Features

Termost allows building command line tools in a minute thanks to its:

-   [Fluent](https://en.wikipedia.org/wiki/Fluent_interface) syntax to express your CLI configurations with instructions such as:
    -   [Subcommand](examples/command/src/index.ts) support
    -   Long and short [option](examples/option/src/index.ts) support
    -   [User input](examples/input/src/index.ts) support
    -   [Task](examples/task/src/index.ts) support
-   Shareable output between instructions
-   Auto-generated help and version metadata
-   TypeScript support to foster a type-safe API
-   Built-in helpers to make stdin/stdout management a breeze (including exec, and message helpers...)

<br>

## 🚀 Quickstart

Install the library:

```bash
# Npm
npm install termost
# Pnpm
pnpm add termost
# Yarn
yarn add termost
```

Once you're done, you can play with the API:

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

type ProgramContext = {
	sharedOutput: string;
	option: string;
};

const program = termost<ProgramContext>("My super program description");

program
	.option({
		key: "option",
		name: { long: "flag", short: "f" },
		description: "A super useful CLI flag",
		defaultValue: "Hello from option",
	})
	.task({
		key: "sharedOutput",
		label: "Retrieves files",
		async handler() {
			return await helpers.exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
	})
	.task({
		handler(context) {
			helpers.message(`Task value: ${context.sharedOutput}`);
			helpers.message(`Option value: ${context.option}`, {
				type: "warning",
			});
		},
	});
```

The output will look like this:

<img width="287" alt="Capture d’écran 2021-08-17 à 15 45 53" src="https://user-images.githubusercontent.com/10498826/129737100-52d70ee4-66a1-4f56-96ec-b56c7f378a50.png">

<br>

## ✍️ Usage

Here's an API overview:

<details>
<summary><b>command({ name, description })</b></summary>
<p>

The `command` API creates a new subcommand context.  
Please note that the root command context is shared across subcommands but subcommand's contexts are scoped and not accessible between each other.

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

const program = termost("Example to showcase the `command` API");

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.task({
		handler(context, argv) {
			helpers.message(`👋 Hello, I'm the ${argv.command} command`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.task({
		handler(context, argv) {
			helpers.message(`👋 Hello, I'm the ${argv.command} command`, {
				type: "warning",
			});
		},
	});
```

</p>
</details>

<details>
<summary><b>input({ key, label, type, skip, ...typeParameters })</b></summary>
<p>

The `input` API creates an interactive prompt.  
It supports several types:

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

type ProgramContext = {
	input1: "singleOption1" | "singleOption2";
	input2: Array<"multipleOption1" | "multipleOption2">;
	input3: boolean;
	input4: string;
};

const program = termost<ProgramContext>("Example to showcase the `input` API");

program
	.input({
		type: "select",
		key: "input1",
		label: "What is your single choice?",
		options: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption2",
	})
	.input({
		type: "multiselect",
		key: "input2",
		label: "What is your multiple choices?",
		options: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
	})
	.input({
		type: "confirm",
		key: "input3",
		label: "Are you sure to skip next input?",
		defaultValue: false,
	})
	.input({
		type: "text",
		key: "input4",
		label: (context) =>
			`Dynamic input label generated from a contextual value: ${context.input1}`,
		defaultValue: "Empty input",
		skip(context) {
			return Boolean(context.input3);
		},
	})
	.task({
		handler(context) {
			helpers.message(JSON.stringify(context, null, 4));
		},
	});
```

</p>
</details>

<details>
<summary><b>option({ key, name, description, defaultValue, skip })</b></summary>
<p>

The `option` API defines a contextual CLI option.  
The option value can be accessed through its `key` property from the current context.

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

type ProgramContext = {
	optionWithAlias: number;
	optionWithoutAlias: string;
};

const program = termost<ProgramContext>("Example to showcase the `option` API");

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
	})
	.task({
		handler(context) {
			helpers.message(JSON.stringify(context, null, 2));
		},
	});
```

</p>
</details>

<details>
<summary><b>task({ key, label, handler, skip })</b></summary>
<p>

The `task` executes a handler (either a synchronous or an asynchronous one).  
The output can be either:

-   Displayed gradually if no `label` is provided
-   Displayed until the promise is fulfilled if a `label` property is specified (in the meantime, a spinner with the label is showcased)

```ts
#!/usr/bin/env node

import { helpers, termost } from "../src";

type ProgramContext = {
	computedFromOtherTaskValues: "big" | "small";
	execOutput: string;
	size: number;
};

const program = termost<ProgramContext>("Example to showcase the `task` API");

program
	.task({
		key: "size",
		label: "Task with returned value (persisted)",
		async handler() {
			return 45;
		},
	})
	.task({
		label: "Task with side-effect only (no persisted value)",
		async handler() {
			await wait(500);
			// @note: side-effect only handler
		},
	})
	.task({
		key: "computedFromOtherTaskValues",
		label: "Task can also access other persisted task values",
		handler(context) {
			if (context.size > 2000) {
				return Promise.resolve("big");
			}

			return Promise.resolve("small");
		},
	})
	.task({
		key: "execOutput",
		label: "Or even execute external commands thanks to its provided helpers",
		handler() {
			return helpers.exec("echo 'Hello from shell'");
		},
	})
	.task({
		label: "A task can be skipped as well",
		async handler() {
			await wait(2000);

			return Promise.resolve("Super long task");
		},
		skip(context) {
			const needOptimization = context.size > 2000;

			return !needOptimization;
		},
	})
	.task({
		label: (context) =>
			`A task can have a dynamic label generated from contextual values: ${context.computedFromOtherTaskValues}`,
		async handler() {},
	})
	.task({
		handler(context) {
			helpers.message(
				`If you don't specify a label, the handler is executed in "live mode" (the output is not hidden by the label and is displayed gradually).`,
				{ label: "Label & console output" },
			);

			helpers.message(
				`A task with a specified "key" can be retrieved here. Size = ${context.size}. If no "key" was specified the task returned value cannot be persisted across program instructions.`,
				{ label: "Context management" },
			);
		},
	})
	.task({
		handler(context) {
			const content =
				"The `message` helpers can be used to display task content in a nice way";

			helpers.message(content, {
				label: "Output formatting",
			});
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
				},
			);
			console.log(
				helpers.format(
					"\nYou can also have a total control on the formatting through the `format` helper.",
					{
						color: "white",
						modifiers: ["italic", "strikethrough", "bold"],
					},
				),
			);

			console.info(JSON.stringify(context, null, 2));
		},
	});

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};
```

</p>
</details>

<br>

## 🤩 Built with Termost

-   [Quickbundle](https://github.com/adbayb/quickbundle) The zero-configuration bundler powered by ESBuild

<br>

## 💙 Acknowledgements

This project is built upon solid open-source foundations. We'd like to thank:

-   [`enquirer`](https://www.npmjs.com/package/enquirer) for managing `input` internals
-   [`listr2`](https://www.npmjs.com/package/listr2) for managing `task` internals

<br>

## 📖 License

[MIT](https://github.com/adbayb/termost/blob/main/LICENSE "License MIT")
