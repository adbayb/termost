import process from "node:process";
import { spawn } from "node:child_process";

export const exec = async (
	command: string,
	options: ExecOptions = { hasLiveOutput: false },
) => {
	return new Promise<string>((resolve, reject) => {
		let stdout = "";
		let stderr = "";
		const [bin, ...args] = command.split(" ") as [string, ...string[]];

		// eslint-disable-next-line sonarjs/os-command
		const childProcess = spawn(bin, args, {
			cwd: options.cwd,
			env: {
				// eslint-disable-next-line n/no-process-env
				...process.env,
				// @note: make sure to force color display for spawned processes
				FORCE_COLOR: "1",
			},
			shell: true,
			stdio: options.hasLiveOutput ? "inherit" : "pipe",
		});

		childProcess.stdout?.on("data", (chunk: string) => {
			stdout += chunk;
		});

		childProcess.stderr?.on("data", (chunk: string) => {
			stderr += chunk;
		});

		childProcess.on("close", (exitCode) => {
			if (exitCode !== 0) {
				const output = `${stderr}${stdout}`;

				reject(new Error(output.trim()));
			} else {
				resolve(stdout.trim());
			}
		});
	});
};

type ExecOptions = {
	cwd?: string;
	hasLiveOutput?: boolean;
};
