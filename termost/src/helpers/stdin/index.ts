import process from "node:process";

export const getArguments = () => {
	const parameters = process.argv.slice(2);
	let command: string | undefined;
	const operands: string[] = [];
	const options: Record<string, boolean | number | string> = {};
	let currentOptionName: string | undefined;

	const addOptimisticOption = (name: string, value?: boolean | string) => {
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

		if (shortFlagMatchResult?.name) {
			flushOptimisticOption();

			const optionFlags = [...shortFlagMatchResult.name];
			const lastIndex = optionFlags.length - 1;

			optionFlags.forEach((flag, index) => {
				addOptimisticOption(
					flag,
					lastIndex === index ? undefined : true,
				);
			});
		} else if (longFlagMatchResult?.name) {
			flushOptimisticOption();
			addOptimisticOption(
				longFlagMatchResult.name,
				longFlagMatchResult.value,
			);
		} else if (currentOptionName) {
			options[currentOptionName] = castValue(parameter);
			currentOptionName = undefined;
		} else if (!command) {
			command = parameter;
		} else {
			operands.push(parameter);
		}
	}

	flushOptimisticOption();

	return { command, operands, options };
};

const SHORT_FLAG_REGEX = /^-(?<name>(?!-).*)$/;
const LONG_FLAG_REGEX = /^--(?<name>.*?)(?:=(?<value>.+))?$/;

const castValue = (value: string) => {
	try {
		return JSON.parse(value) as boolean | number | string;
	} catch {
		return value;
	}
};
