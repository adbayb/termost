import Listr from "listr";
import {
	ContextValues,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
} from "../types";
import { exec } from "../../core/process";

export const createTask: CreateInstruction<
	TaskParameters<ContextValues, keyof ContextValues>
> = (parameters) => {
	const { key, label, handler } = parameters;
	const receiver = new Listr();

	return async function execute(commandContext) {
		let value: unknown;

		receiver.add({
			title: label,
			task: async () =>
				(value = await handler(commandContext.values, HELPERS)),
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
			label: string;
			handler: (
				values: Values,
				helpers: typeof HELPERS
			) => Promise<Values[Key]>;
	  }
	: {
			label: string;
			handler: (values: Values, helpers: typeof HELPERS) => void;
	  };
