import { CommandName } from "../../features/types";
import { createQueue } from "./queue";

export const getManager = (commandName: CommandName): Manager => {
	const manager = managerCollection[commandName];

	if (!manager) {
		throw new Error(
			`No manager has been instantiated for the \`${commandName}\` command`
		);
	}

	return manager;
};

export const createManager = (commandName: CommandName): Manager => {
	const instructions = createQueue<Instruction>();

	const manager: Manager = {
		// addValue,
		// addOption,
		// getValue,
		// getOption,
		addInstruction(instruction) {
			instructions.enqueue(instruction);
		},
		async run() {
			while (!instructions.isEmpty()) {
				const task = instructions.dequeue();

				if (task) {
					await task();
				}
			}
		},
	};

	managerCollection[commandName] = manager;

	return manager;
};

type Instruction = () => Promise<void>;

type Manager = {
	addInstruction(instruction: Instruction): void;
	run(): Promise<void>;
};

const managerCollection: Record<CommandName, Manager> = {};
