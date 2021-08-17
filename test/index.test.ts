import { exec } from "../src/core/process";

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

		expect(helpOutput).toMatchSnapshot();
		expect(buildOutput).toMatchSnapshot();
		expect(watchOutput).toMatchSnapshot();
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
