import { spawn } from "child_process";

export const exec = async (
	command: string,
	options: ExecOptions = { hasLiveOutput: false },
) => {
	return new Promise<string>((resolve, reject) => {
		let stdout = "";
		let stderr = "";
		const [bin, ...args] = command.split(" ") as [string, ...string[]];

		const childProcess = spawn(bin, args, {
			cwd: options.cwd,
			env: {
				...process.env,
				// @note: make sure to force color display for spawned processes
				FORCE_COLOR: "1",
			},
			shell: true,
			stdio: options.hasLiveOutput ? "inherit" : "pipe",
		});

		childProcess.stdout?.on("data", (chunk) => {
			stdout += chunk;
		});

		childProcess.stderr?.on("data", (chunk) => {
			stderr += chunk;
		});

		childProcess.on("close", (exitCode) => {
			if (exitCode !== 0) {
				const output = `${stderr}${stdout}`;

				reject(output.trim());
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
