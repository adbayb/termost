- [ ] Replace listr by listr2
- [ ] Replace inquirer by enquirer https://github.com/enquirer/enquirer
- [ ] Update API

```ts
type ProgramContext = {
	globalOption: number;
};

type BuildCommandContext = {
	buildOption: number;
};

type WatchCommandContext = {
	watchOption: number;
};

const program = termost<ProgramContext>("Super CLI program");
const buildCommand = program.command<BuildCommandContext>(
	"build",
	"description"
); // ProgramContext is not available within a subcommand. A subcommand is always a new program context with no parent inheritence
const watchCommand = program.command<WatchCommandContext>(
	"watch",
	"description"
);

program.option({
	key: "globalOption",
	name: { long: "shortOption", short: "s" },
	description: "Useful CLI flag",
	defaultValue: 0,
});

buildCommand.option({
	key: "buildOption",
	name: { long: "shortOption", short: "s" },
	description: "Useful CLI flag",
	defaultValue: 0,
});

watchCommand.option({
	key: "watchOption",
	name: { long: "shortOption", short: "s" },
	description: "Useful CLI flag",
	defaultValue: 0,
});
```
