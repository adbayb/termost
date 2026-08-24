# Migration

The following guide aims to:

- Log incoming changes impacting consumers before a new deployment.
- Guide the consumer by describing all needed changes to apply.

By impactful changes, we mean non-backward compatible changes ([breaking changes](https://semver.org/)), including:

- Incompatible API changes (e.g. property removal, dependency renaming, ...).
- Dependency upgrade with incompatible changes.
- ...

## To [2.0.0](https://github.com/adbayb/termost/releases/tag/termost@2.0.0) from 1.x.x

### Replace `enquirer` and `listr2` with `@clack/prompts`

The underlying prompt and task runner libraries have been replaced by `@clack/prompts`. This refreshes the UI/UX but should not require code changes for consumers using the high-level `termost` APIs (`input`, `option`, `task`, ...).

| Before                               | After                       |
| ------------------------------------ | --------------------------- |
| `enquirer` and `listr2` dependencies | `@clack/prompts` dependency |

### Remove `helpers` namespace in favor of direct exports

The `helpers` namespace has been removed. `createLogger` and `exec` are now exported directly from `termost`.

```diff
- import { helpers, termost } from "termost";
+ import { createLogger, exec, termost } from "termost";

- const log = helpers.createLogger("my-cli");
+ const log = createLogger({ name: "my-cli" });

- helpers.exec("echo 'Hello from shell'");
+ exec("echo 'Hello from shell'");
```

### Replace `helpers.message` and `helpers.format` with `createLogger`

`helpers.message` and `helpers.format` have been removed in favor of a unified logger built on top of `@clack/prompts`.

```diff
- helpers.message("info", "Hello world");
+ const log = createLogger({ name: "my-cli", level: "info" });
+ logger.info("Hello world");
```

For text styling, use `styleText` from `node:util` instead of `helpers.format`:

```diff
- import { format } from "termost";
- console.log(format.bold("My styled message"));
+ import { styleText } from "node:util";
+ console.log(styleText(["bold", "italic"], "My styled message"));
```
