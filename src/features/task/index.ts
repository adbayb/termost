import Listr from "listr";
import {
	CommandContextValues,
	Instruction,
	InstructionParameters,
} from "../types";

export const createTask = (parameters: TaskParameters): Instruction => {
	const { label, handler } = parameters;
	const receiver = new Listr();

	return async function execute(context) {
		let value: unknown;

		receiver.add({
			title: label,
			task: async () => (value = await handler(context.values)),
		});

		await receiver.run();

		return value;
	};
};

export type TaskParameters = InstructionParameters<{
	label: string;
	handler: (context: CommandContextValues) => Promise<unknown>;
}>;
