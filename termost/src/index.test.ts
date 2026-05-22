import { describe, expect, test } from "vitest";

import { exec } from "./helpers/process";

describe("termost", () => {
	test("should display `version`", async () => {
		const longFlagOutput = await exec(
			"pnpm --filter @examples/default start --version",
		);

		const shortFlagOutput = await exec(
			"pnpm --filter @examples/default start -v",
		);

		expect(longFlagOutput).toMatchSnapshot();
		expect(shortFlagOutput).toMatchSnapshot();
	});

	test("should display `help`", async () => {
		const longFlagOutput = await exec(
			"pnpm --filter @examples/default start --help",
		);

		const shortFlagOutput = await exec(
			"pnpm --filter @examples/default start -h",
		);

		expect(longFlagOutput).toMatchSnapshot();
		expect(shortFlagOutput).toMatchSnapshot();
	});

	test("should display `help` given empty command", async () => {
		const rootCommand = await exec("pnpm --filter @examples/empty start");

		const buildCommand = await exec(
			"pnpm --filter @examples/empty start build",
		);

		const buildCommandWithOption = await exec(
			"pnpm --filter @examples/empty start build --option test",
		);

		const watchCommand = await exec(
			"pnpm --filter @examples/empty start watch",
		);

		expect(rootCommand).toMatchSnapshot();
		expect(buildCommand).toMatchSnapshot();
		expect(buildCommandWithOption).toMatchSnapshot();
		expect(watchCommand).toMatchSnapshot();
	});

	test("should handle `validation`", async () => {
		await expect(async () =>
			exec("pnpm --filter @examples/validation start:test -o error"),
		).rejects.toThrow(/Invalid option->input/);
		await expect(async () =>
			exec("pnpm --filter @examples/validation start:test"),
		).rejects.toThrow(/Invalid task->input/);
	});

	test("should handle `command` api", async () => {
		const helpOutput = await exec(
			"pnpm --filter @examples/command start --help",
		);

		const buildOutput = await exec(
			"pnpm --filter @examples/command start build",
		);

		const watchOutput = await exec(
			"pnpm --filter @examples/command start watch",
		);

		const buildSharedFlagOutput = await exec(
			"pnpm --filter @examples/command start build --global --local hello",
		);

		const watchSharedFlagOutput = await exec(
			"pnpm --filter @examples/command start watch --global",
		);

		const buildHelpOutput = await exec(
			"pnpm --filter @examples/command start build --help",
		);

		const watchHelpOutput = await exec(
			"pnpm --filter @examples/command start watch --help",
		);

		expect(helpOutput).toMatchSnapshot();
		expect(buildOutput).toMatchSnapshot();
		expect(watchOutput).toMatchSnapshot();
		expect(buildSharedFlagOutput).toMatchSnapshot();
		expect(watchSharedFlagOutput).toMatchSnapshot();
		expect(buildHelpOutput).toMatchSnapshot();
		expect(watchHelpOutput).toMatchSnapshot();
	});

	test("should handle `option` api", async () => {
		const output = await exec("pnpm --filter @examples/option start");

		expect(output).toMatchSnapshot();
	});

	test("should handle `task` api", async () => {
		const output = await exec("pnpm --filter @examples/task start");

		expect(output).toMatchSnapshot();
	});
});
