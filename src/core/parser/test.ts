import { parseArguments } from ".";

// termost watch operand1 --help --option1 value1 --option2=value2 -al lastValue operand2 -t short -b
process.argv = [
	"/bin/node",
	"./node_modules/.bin/termost",
	"watch",
	"operand1",
	"--help",
	"--option1",
	"value1",
	"--option2=value2",
	"-al",
	"lastValue",
	"operand2",
	"-t",
	"short",
	"-b",
];

describe("parseArguments", () => {
	test("should get command name", () => {
		expect(parseArguments().command).toBe(process.argv[2]);
	});

	test("should get operands", () => {
		expect(parseArguments().operands).toStrictEqual([
			"operand1",
			"operand2",
		]);
	});

	test("should get options", () => {
		expect(parseArguments().options).toStrictEqual({
			a: true,
			b: true,
			help: true,
			l: "lastValue",
			option1: "value1",
			option2: "value2",
			t: "short",
		});
	});
});
