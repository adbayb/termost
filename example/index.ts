import termost from "../src";

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};

const program = termost("A real world example (bundler CLI)");

program
	.command({
		name: "build",
		description: "Transpile and bundle in production mode",
	})
	.task({
		label: "Building esm, cjs 👷‍♂️",
		async handler() {
			await wait(1000);
		},
	})
	.task({
		key: "size",
		label: "Calculating bundle size 📐",
		async handler() {
			await wait(1000);

			return 223434;
		},
	})
	.message({
		handler(values, helpers) {
			const size: number = values.size;

			helpers.print([
				"📦 main.js",
				`   ${String(size).padEnd(8)} B  raw`,
				`   ${String(size / 3).padEnd(8)} B  gzip`,
				"📦 other.js",
				`   ${String(size).padEnd(8)} B  raw`,
				`   ${String(size / 3).padEnd(8)} B  gzip`,
			]);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "warning" }
			);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "error" }
			);

			helpers.print(
				[
					"📦 main.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
					"📦 other.js",
					`   ${String(size).padEnd(8)} B  raw`,
					`   ${String(size / 3).padEnd(8)} B  gzip`,
				],
				{ type: "success", label: "Output sizes" }
			);

			console.log(
				helpers.format("Custom formatting", {
					color: "white",
					modifier: ["italic", "strikethrough"],
				})
			);
		},
	});

program
	.command({
		name: "watch",
		description: "Rebuild your assets on any code change",
	})
	.task({
		label: `Watching 🔎 last at ${new Date().toLocaleTimeString()}`,
		async handler() {
			return await wait(1000);
		},
	});

program
	.option({
		key: "optionWithAlias",
		name: { long: "shortOption", short: "s" },
		description: "Useful CLI flag",
		defaultValue: 0,
	})
	.option({
		key: "optionWithoutAlias",
		name: "longOption",
		description: "Useful CLI flag",
		defaultValue: 1,
	})
	.task({
		key: "ls",
		label: "Retrieves files",
		async handler(_, helpers) {
			await wait(1000);

			return await helpers.exec("ls -al", {
				cwd: process.cwd(),
			});
		},
	})
	.message({
		handler(values, helpers) {
			helpers.print(values.ls);
			console.log("values", values);
		},
	});
