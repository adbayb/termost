import { getArguments } from ".";

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

describe("getArguments", () => {
	test("should parse command name", () => {
		expect(getArguments().command).toBe(process.argv[2]);
	});

	test("should parse operands", () => {
		expect(getArguments().operands).toStrictEqual(["operand1", "operand2"]);
	});

	test("should parse options", () => {
		expect(getArguments().options).toStrictEqual({
			a: true,
			b: true,
			help: true,
			l: "lastValue",
			option1: "value1",
			option2: "value2",
			t: "short",
		});
	});

	test("should parse correctly given unordered argument", () => {
		process.argv = [
			"/bin/node",
			"./node_modules/.bin/termost",
			"--lastOption",
			"lastValue",
			"watch",
		];

		expect(getArguments()).toStrictEqual({
			command: "watch",
			operands: [],
			options: {
				lastOption: "lastValue",
			},
		});

		process.argv = [
			"/bin/node",
			"./node_modules/.bin/termost",
			"--lastOption",
			"watch",
			"lastValue",
		];

		expect(getArguments()).toStrictEqual({
			command: "lastValue",
			operands: [],
			options: {
				lastOption: "watch",
			},
		});
	});

	test("should parse correctly given a last option value", () => {
		process.argv = [
			"/bin/node",
			"./node_modules/.bin/termost",
			"watch",
			"--lastOption",
			"lastValue",
		];

		expect(getArguments()).toStrictEqual({
			command: "watch",
			operands: [],
			options: {
				lastOption: "lastValue",
			},
		});
	});
});
