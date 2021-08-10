import { Context } from "../../context";
import { Dictionary } from "../dictionary";

type OptionValue = Context["options"][number];

// eslint-disable-next-line sonarjs/cognitive-complexity
export const parseArguments = () => {
	const parameters = process.argv.slice(2);
	const restArguments: Array<string> = [];
	const options = new Dictionary<OptionValue>();
	let currentOption: string | undefined = undefined;

	const flushOption = (value?: string) => {
		if (currentOption) {
			options.set(currentOption, castValue(value));
			currentOption = undefined;
		}
	};

	for (const param of parameters) {
		if (param[0] !== "-") {
			if (!currentOption) {
				restArguments.push(param);
			} else {
				flushOption(param);
			}

			continue;
		}

		const isLongFlag = param[1] === "-";
		const flagParams = isLongFlag ? [param.slice(2)] : [...param.slice(1)];
		const lastFlagIndex = flagParams.length - 1;

		for (let i = 0; i <= lastFlagIndex; i++) {
			const flag = flagParams[i] as string;

			if (i === lastFlagIndex) {
				flushOption();
				currentOption = flag;
			} else {
				options.set(flag, true);
			}
		}
	}

	flushOption();

	const [command, ...operands] = restArguments;

	return { command, operands, options: options.values() };
};

const castValue = (value?: string) => {
	if (value === undefined) {
		return true;
	}

	try {
		return JSON.parse(value) as OptionValue;
	} catch {
		return value;
	}
};
