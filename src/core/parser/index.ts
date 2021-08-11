import { Context } from "../../context";

// eslint-disable-next-line sonarjs/cognitive-complexity
export const parseArguments = () => {
	const parameters = process.argv.slice(2);
	let command: string | undefined;
	const operands: Array<string> = [];
	const options: Record<string, string | boolean | number> = {};
	let currentOptionName: string | undefined;

	const addOptimisticOption = (name: string, value?: string | boolean) => {
		if (value) {
			options[name] = typeof value === "string" ? castValue(value) : true;
		} else {
			currentOptionName = name;
		}
	};

	const flushOptimisticOption = () => {
		if (currentOptionName) {
			options[currentOptionName] = true;
			currentOptionName = undefined;
		}
	};

	for (const parameter of parameters) {
		const shortFlagMatchResult = SHORT_FLAG_REGEX.exec(parameter)?.groups;
		const longFlagMatchResult = LONG_FLAG_REGEX.exec(parameter)?.groups;

		if (shortFlagMatchResult || longFlagMatchResult) {
			flushOptimisticOption();

			let name: string | undefined;

			if (shortFlagMatchResult && (name = shortFlagMatchResult.name)) {
				const optionFlags = name.split("");
				const lastIndex = optionFlags.length - 1;

				optionFlags.forEach((flag, index) => {
					addOptimisticOption(
						flag,
						lastIndex === index ? undefined : true
					);
				});
			} else if (
				longFlagMatchResult &&
				(name = longFlagMatchResult.name)
			) {
				addOptimisticOption(name, longFlagMatchResult.value);
			}
		} else {
			if (currentOptionName) {
				options[currentOptionName] = castValue(parameter);
				currentOptionName = undefined;
			} else {
				!command ? (command = parameter) : operands.push(parameter);
			}
		}
	}

	flushOptimisticOption();

	return { command, operands, options };
};

const SHORT_FLAG_REGEX = /^-(?<name>(?!-).*)$/;
const LONG_FLAG_REGEX = /^--(?<name>.*?)(?:=(?<value>.+))?$/;

const castValue = (value: string) => {
	try {
		return JSON.parse(value) as Context["options"][number];
	} catch {
		return value;
	}
};
