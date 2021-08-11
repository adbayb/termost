import Listr from "listr";
import {
	CommandContextValues,
	Instruction,
	InstructionParameters,
} from "../types";
import { exec } from "./helpers";

export const createTask = (parameters: TaskParameters): Instruction => {
	const { label, handler } = parameters;
	const receiver = new Listr();

	return async function execute(context) {
		let value: unknown;

		receiver.add({
			title: label,
			task: async () => (value = await handler(context.values, HELPERS)),
		});

		await receiver.run();

		return value;
	};
};

const HELPERS = {
	exec,
};

export type TaskParameters = InstructionParameters<{
	label: string;
	handler: (
		values: CommandContextValues,
		helpers: typeof HELPERS
	) => Promise<unknown>;
}>;
