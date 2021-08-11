import { spawn } from "child_process";

export const exec = async (command: string, options: ExecOptions = {}) => {
	const promise = new Promise<string>((resolve, reject) => {
		let stdout = "";
		let stderr = "";
		const [bin, ...args] = command.split(" ") as [string, ...string[]];

		const childProcess = spawn(bin, args, {
			cwd: options.cwd,
			shell: true,
			stdio: "pipe",
			env: {
				...process.env,
				// @note: make sure to force color display for spawned processes
				FORCE_COLOR: "1",
			},
		});

		childProcess.stdout.on("data", (chunk) => {
			stdout += chunk;
		});

		childProcess.stderr.on("data", (chunk) => {
			stderr += chunk;
		});

		childProcess.on("close", (exitCode) => {
			if (exitCode !== 0) {
				reject(stderr.trim());
			} else {
				resolve(stdout.trim());
			}
		});
	});

	try {
		return await promise;
	} catch (error) {
		throw new Error(error);
	}
};

type ExecOptions = {
	cwd?: string;
};
