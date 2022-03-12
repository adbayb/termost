import { Listr } from "listr2";
import {
	Context,
	CreateInstruction,
	DefaultValues,
	InstructionKey,
	InstructionParameters,
	Label,
} from "../types";
import { exec } from "../../core/process";

export const createTask: CreateInstruction<
	TaskParameters<DefaultValues, keyof DefaultValues>
> = (parameters) => {
	const { key, label, handler } = parameters;
	const receiver = new Listr([]);

	return async function execute(context) {
		let value: unknown;

		receiver.add({
			title: typeof label === "function" ? label(context) : label,
			task: async () => (value = await handler(context, HELPERS)),
		});

		await receiver.run();

		return { key, value };
	};
};

const HELPERS = {
	exec,
};

export type TaskParameters<Values, Key> = InstructionParameters<
	Values,
	Parameters<Values, Key>
>;

type Parameters<Values, Key> = Key extends keyof Values
	? Partial<InstructionKey<Key>> & {
			label: Label<Values>;
			handler: (
				context: Context<Values>,
				helpers: typeof HELPERS
			) => Promise<Values[Key]>;
	  }
	: {
			label: Label<Values>;
			handler: (
				context: Context<Values>,
				helpers: typeof HELPERS
			) => void;
	  };
