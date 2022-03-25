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
    -   [Subcommand](example/withCommand.ts) support
    -   Long and short [option](example/withOption.ts) support
    -   [Interaction](example/withQuestion.ts) support
    -   [Task](example/withTask.ts) support
-   Shareable outputs between instruction
-   Beautiful CLI message formatting via `message` instruction
-   Auto-generated help and version information
-   TypeScript support to foster a type-safe API

<br>

## 🚀 Quickstart

Install the library:

```bash
# NPM
npm install termost
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
	.message({
		handler(context) {
			helpers.print(`Task value: ${context.sharedOutput}`);
			helpers.print(`Option value: ${context.option}`, {
				type: "warning",
			});
		},
	});
```

The output will look like:

<img width="287" alt="Capture d’écran 2021-08-17 à 15 45 53" src="https://user-images.githubusercontent.com/10498826/129737100-52d70ee4-66a1-4f56-96ec-b56c7f378a50.png">

<br>

## ✍️ Usage

Here's an API overview:

<details>
<summary><b>command({ name, description })</b></summary>
<p>

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

const program = termost("Example to showcase the `command` API");

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.message({
		handler(context, argv) {
			helpers.print(`👋 Hello, I'm the ${argv.command} command`);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(context, argv) {
			helpers.print(`👋 Hello, I'm the ${argv.command} command`, {
				type: "warning",
			});
		},
	});
```

</p>
</details>

<details>
<summary><b>option({ key, name, description, defaultValue, skip })</b></summary>
<p>

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
	.message({
		handler(context) {
			helpers.print(JSON.stringify(context, null, 2));
		},
	});
```

</p>
</details>

<details>
<summary><b>message({ handler, skip })</b></summary>
<p>

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

const program = termost("Example to showcase the `message` API");

program.message({
	handler(context) {
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
```

</p>
</details>

<details>
<summary><b>question({ key, label, type, skip, ...typeParameters })</b></summary>
<p>

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

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
		type: "select",
		key: "question1",
		label: "What is your single choice?",
		options: ["singleOption1", "singleOption2"],
		defaultValue: "singleOption2",
	})
	.question({
		type: "multiselect",
		key: "question2",
		label: "What is your multiple choices?",
		options: ["multipleOption1", "multipleOption2"],
		defaultValue: ["multipleOption2"],
	})
	.question({
		type: "confirm",
		key: "question3",
		label: "Are you sure to skip next question?",
		defaultValue: false,
	})
	.question({
		type: "text",
		key: "question4",
		label: (context) =>
			`Dynamic question label generated from a contextual value: ${context.question1}`,
		defaultValue: "Empty input",
		skip(context) {
			return Boolean(context.question3);
		},
	})
	.message({
		handler(context) {
			helpers.print(JSON.stringify(context, null, 4));
		},
	});
```

</p>
</details>

<details>
<summary><b>task({ key, label, handler, skip })</b></summary>
<p>

```ts
#!/usr/bin/env node

import { termost, helpers } from "termost";

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
		handler() {
			// @note: side-effect only handler
		},
	})
	.task({
		key: "computedFromOtherTaskValues",
		label: "Task can also access other persisted task context",
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
		handler(context) {
			return helpers.exec("ls -al");
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
	.message({
		handler(context) {
			helpers.print(
				`A task with a specified "key" can be retrieved here. Size = ${context.size}. If no "key" was specified the task returned value cannot be persisted across program instructions.`
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

This project is built upon solid open source foundations. We'd like to thank:

-   [`prompts`](https://www.npmjs.com/package/prompts) for managing `question` internals
-   [`listr2`](https://www.npmjs.com/package/listr2) for managing `task` internals

<br>

## 📖 License

[MIT](./LICENSE "License MIT")
