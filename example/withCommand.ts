import termost from "../src";

const program = termost("Example to showcase the `command` API");

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

const wait = (delay: number) => {
	return new Promise((resolve) => setTimeout(resolve, delay));
};
