import { describe, expect, test } from "vitest";

import { exec } from "./helpers/process";

describe("termost", () => {
	test("should display `help`", async () => {
		const longFlagOutput = await safeExec(
			"pnpm --filter @examples/default start --help",
		);

		const shortFlagOutput = await safeExec(
			"pnpm --filter @examples/default start -h",
		);

		expect(longFlagOutput).toMatchSnapshot();
		expect(shortFlagOutput).toMatchSnapshot();
	});

	test("should display `help` given empty root command", async () => {
		const output = await safeExec("pnpm --filter @examples/command start");

		expect(output).toMatchSnapshot();
	});

	test("should handle `command` api", async () => {
		const helpOutput = await safeExec(
			"pnpm --filter @examples/command start --help",
		);

		const buildOutput = await safeExec(
			"pnpm --filter @examples/command start build",
		);

		const watchOutput = await safeExec(
			"pnpm --filter @examples/command start watch",
		);

		const buildSharedFlagOutput = await safeExec(
			"pnpm --filter @examples/command start build --global --local hello",
		);

		const watchSharedFlagOutput = await safeExec(
			"pnpm --filter @examples/command start watch --global",
		);

		const buildHelpOutput = await safeExec(
			"pnpm --filter @examples/command start build --help",
		);

		const watchHelpOutput = await safeExec(
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
		const output = await safeExec("pnpm --filter @examples/option start");

		expect(output).toMatchSnapshot();
	});

	test("should handle `task` api", async () => {
		const output = await safeExec("pnpm --filter @examples/task start");

		expect(output).toMatchSnapshot();
	});
});

/**
 * A test utility to strip contextual information (including absolute paths) output by `pnpm --filter run` command.
 * It allows to run tests whatever the testing environment (CI, local, ...).
 * @param command The command to run
 * @returns The generic command output
 */
const safeExec = async (command: string) => {
	const output = await exec(command);

	return output.toString().split("\n").slice(3).join("\n");
};
