import { exec } from "../src/core/process";

jest.setTimeout(20000);

describe("termost", () => {
	test("should display `help`", async () => {
		const output = await exec(
			"node -r esbuild-register example/index.ts --help"
		);

		expect(output).toMatchSnapshot();
	});

	test("should handle `command` api", async () => {
		const helpOutput = await exec(
			"node -r esbuild-register example/withCommand.ts --help"
		);
		const buildOutput = await exec(
			"node -r esbuild-register example/withCommand.ts build"
		);
		const watchOutput = await exec(
			"node -r esbuild-register example/withCommand.ts watch"
		);
		const buildSharedFlagOutput = await exec(
			"node -r esbuild-register example/withCommand.ts build --global --local hello"
		);
		const watchSharedFlagOutput = await exec(
			"node -r esbuild-register example/withCommand.ts watch --global"
		);
		const buildHelpOutput = await exec(
			"node -r esbuild-register example/withCommand.ts build --help"
		);
		const watchHelpOutput = await exec(
			"node -r esbuild-register example/withCommand.ts watch --help"
		);

		expect(helpOutput).toMatchSnapshot();
		expect(buildOutput).toMatchSnapshot();
		expect(watchOutput).toMatchSnapshot();
		expect(buildSharedFlagOutput).toMatchSnapshot();
		expect(watchSharedFlagOutput).toMatchSnapshot();
		expect(buildHelpOutput).toMatchSnapshot();
		expect(watchHelpOutput).toMatchSnapshot();
	});

	test("should handle `message` api", async () => {
		const output = await exec(
			"node -r esbuild-register example/withMessage.ts"
		);

		expect(output).toMatchSnapshot();
	});

	test("should handle `option` api", async () => {
		const output = await exec(
			"node -r esbuild-register example/withOption.ts"
		);

		expect(output).toMatchSnapshot();
	});
});
