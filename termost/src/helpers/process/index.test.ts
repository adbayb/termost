import { describe, expect, test } from "vitest";
import { exec } from ".";

describe("process", () => {
	test("should `exec` given no error", async () => {
		expect.hasAssertions();
		await expect(exec('echo "Plop"')).resolves.toBe("Plop");
	});

	test("should `exec` given error", async () => {
		expect.hasAssertions();
		await expect(exec("unavailable_command12345")).rejects.toThrow(/not found/u);
	});
});
