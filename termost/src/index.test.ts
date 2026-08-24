import { describe, expect, test } from "vitest";
import { exec } from "./helpers/process";

// @note: force CI mode so that @clack/prompts spinners produce deterministic output.
process.env.CI = "true";

describe("termost", () => {
	test("should display `version`", async () => {
		expect.hasAssertions();

		const longFlagOutput = await exec("pnpm --filter @examples/default start --version");
		const shortFlagOutput = await exec("pnpm --filter @examples/default start -v");

		expect(longFlagOutput).toMatchSnapshot("long flag");
		expect(shortFlagOutput).toMatchSnapshot("short flag");
	});

	test("should display `help`", async () => {
		expect.hasAssertions();

		const longFlagOutput = await exec("pnpm --filter @examples/default start --help");
		const shortFlagOutput = await exec("pnpm --filter @examples/default start -h");

		expect(longFlagOutput).toMatchSnapshot("long flag");
		expect(shortFlagOutput).toMatchSnapshot("short flag");
	});

	test("should display `help` given empty command", async () => {
		expect.hasAssertions();

		const rootCommand = await exec("pnpm --filter @examples/empty start");
		const buildCommand = await exec("pnpm --filter @examples/empty start build");

		const buildCommandWithOption = await exec(
			"pnpm --filter @examples/empty start build --option test",
		);

		const watchCommand = await exec("pnpm --filter @examples/empty start watch");

		expect(rootCommand).toMatchSnapshot("root command");
		expect(buildCommand).toMatchSnapshot("build command");
		expect(buildCommandWithOption).toMatchSnapshot("build command with option");
		expect(watchCommand).toMatchSnapshot("watch command");
	});

	test("should handle `validation`", async () => {
		expect.hasAssertions();

		await expect(async () => {
			return exec("pnpm --filter @examples/validation start:test -o error");
		}).rejects.toThrow(/Invalid option->input/u);

		await expect(async () => {
			return exec("pnpm --filter @examples/validation start:test");
		}).rejects.toThrow(/Invalid task->input/u);
	});

	test("should handle `command` api", async () => {
		expect.hasAssertions();

		const helpOutput = await exec("pnpm --filter @examples/command start --help");
		const buildOutput = await exec("pnpm --filter @examples/command start build");
		const watchOutput = await exec("pnpm --filter @examples/command start watch");

		const buildSharedFlagOutput = await exec(
			"pnpm --filter @examples/command start build --global --local hello",
		);

		const watchSharedFlagOutput = await exec(
			"pnpm --filter @examples/command start watch --global",
		);

		const buildHelpOutput = await exec("pnpm --filter @examples/command start build --help");
		const watchHelpOutput = await exec("pnpm --filter @examples/command start watch --help");

		expect(helpOutput).toMatchSnapshot("help output");
		expect(buildOutput).toMatchSnapshot("build output");
		expect(watchOutput).toMatchSnapshot("watch output");
		expect(buildSharedFlagOutput).toMatchSnapshot("build shared flag output");
		expect(watchSharedFlagOutput).toMatchSnapshot("watch shared flag output");
		expect(buildHelpOutput).toMatchSnapshot("build help output");
		expect(watchHelpOutput).toMatchSnapshot("watch help output");
	});

	test("should handle `option` api", async () => {
		expect.hasAssertions();

		const output = await exec("pnpm --filter @examples/option start");

		expect(output).toMatchSnapshot();
	});

	test("should handle `task` api", async () => {
		expect.hasAssertions();

		const output = await exec("pnpm --filter @examples/task start");

		expect(output).toMatchSnapshot();
	});
});
