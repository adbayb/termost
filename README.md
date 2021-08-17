<br>
<div align="center">
    <h1>💻 Termost</h1>
    <strong>Get the most of your terminal</strong>
</div>
<br>
<br>

## ✨ Features

Termost allows you build command line tools in a minute thanks to its:

-   [Fluent](https://en.wikipedia.org/wiki/Fluent_interface) syntax to express your CLI configurations with instructions such as:
    -   [Subcommand](example/withCommand.ts) support
    -   Long and short [option](example/withOption.ts) support
    -   [Interaction](example/withQuestion.ts) support thanks to its built-in [`inquirer`](https://www.npmjs.com/package/inquirer) wrapper
    -   [Tasks](example/withTask.ts) support thanks to its built-in [`Listr`](https://www.npmjs.com/package/listr) wrapper and `exec` helper
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

Once you're done, you can start consuming it in your executable file (binary):

```ts
#!/usr/bin/env node

import { termost } from "termost";

const program = termost<{
	sharedOutput: string;
	option: string;
}>("My super program description");

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
		async handler(_, helpers) {
			return await helpers.exec('echo "Hello from task"', {
				cwd: process.cwd(),
			});
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(`Task value: ${values.sharedOutput}`);
			helpers.print(`Option value: ${values.option}`, {
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

import { termost } from "termost";

const program = termost("Example to showcase the `command` API");

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.message({
		handler(values, helpers) {
			helpers.print("👋 Hello, I'm the `build` command");
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.message({
		handler(values, helpers) {
			helpers.print("👋 Hello, I'm the `watch` command");
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

import { termost } from "termost";

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
		handler(values, helpers) {
			helpers.print(JSON.stringify(values, null, 2));
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

import { termost } from "termost";

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
```

</p>
</details>

<details>
<summary><b>question({ key, label, type, skip, ...typeParameters })</b></summary>
<p>

```ts
#!/usr/bin/env node

type ProgramContext = {
	question1: "singleOption1" | "singleOption2";
	question2: Array<"multipleOption1" | "multipleOption2">;
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
```

</p>
</details>

<details>
<summary><b>task({ key, label, handler, skip })</b></summary>
<p>

```ts
#!/usr/bin/env node

import { termost } from "termost";

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
		label: "Task can also access other persisted task values",
		handler(values) {
			if (values.size > 2000) {
				return Promise.resolve("big");
			}

			return Promise.resolve("small");
		},
	})
	.task({
		key: "execOutput",
		label: "Or even execute external commands thanks to its provided helpers",
		handler(values, helpers) {
			return helpers.exec("ls -al");
		},
	})
	.task({
		label: "A task can be skipped as well",
		async handler() {
			await wait(2000);

			return Promise.resolve("Super long task");
		},
		skip(values) {
			const needOptimization = values.size > 2000;

			return !needOptimization;
		},
	})
	.task({
		label: (values) =>
			`A task can have a dynamic label generated from context values: ${values.computedFromOtherTaskValues}`,
		async handler() {},
	})
	.message({
		handler(values, helpers) {
			helpers.print(
				`A task with a specified "key" can be retrieved here. Size = ${values.size}. If no "key" was specified the task returned value cannot be persisted across program instructions.`
			);

			console.info(JSON.stringify(values, null, 2));
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

## 📖 License

[MIT](./LICENSE "License MIT")
