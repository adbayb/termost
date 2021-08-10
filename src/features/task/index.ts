import Listr from "listr";
import { ContextValues, Instruction, InstructionParameters } from "../types";

export const createTask = (parameters: InternalTaskParameters): Instruction => {
	const { key, label, handler } = parameters;
	const receiver = new Listr();

	return async function execute() {
		let value: unknown;

		receiver.add({
			title: label,
			task: async () => (value = await handler()),
		});

		await receiver.run();

		return { key, value };
	};
};

type InternalTaskParameters = Omit<TaskParameters, "handler"> & {
	handler: () => ReturnType<TaskParameters["handler"]>;
};

export type TaskParameters = InstructionParameters<{
	label: string;
	handler: (context: ContextValues) => Promise<unknown>;
}>;
