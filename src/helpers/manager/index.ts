import { CommandName, Context, ObjectLikeConstraint } from "../../types";
import { createQueue } from "./queue";

export const getManager = <Values extends ObjectLikeConstraint>(
	commandName: CommandName
): Manager<Values> => {
	const manager = managerCollection[commandName];

	if (!manager) {
		throw new Error(
			`No manager has been instantiated for the \`${commandName}\` command`
		);
	}

	return manager as Manager<Values>;
};

export const createManager = <Values extends ObjectLikeConstraint>(
	commandName: CommandName
): Manager<Values> => {
	const instructions = createQueue<Instruction>();
	const context = {
		command: commandName,
		values: {},
	} as Context<Values>;

	const manager: Manager<Values> = {
		addValue(key, value) {
			context.values[key] = value;
		},
		addInstruction(instruction) {
			instructions.enqueue(instruction);
		},
		async enable() {
			while (!instructions.isEmpty()) {
				const task = instructions.dequeue();

				if (task) {
					await task();
				}
			}
		},
		getContext(rootCommandName: CommandName) {
			// @note: By design, global values are accessible to subcommands
			// Consequently, root command values are merged with the current command ones:
			if (commandName !== rootCommandName) {
				const rootManager = getManager(rootCommandName);
				const globalContext = rootManager.getContext(rootCommandName);

				context.values = {
					...globalContext.values,
					...context.values,
				};
			}

			return context;
		},
	};

	managerCollection[commandName] = manager;

	return manager;
};

type Instruction = () => Promise<void>;

type Manager<Values extends ObjectLikeConstraint> = {
	addValue<Key extends keyof Values>(key: Key, value: Values[Key]): void;
	addInstruction(instruction: Instruction): void;
	/**
	 * Iterate over stored instructions and execute them
	 */
	enable(): Promise<void>;
	getContext(rootCommandName: CommandName): Context<Values>;
};

const managerCollection: Record<
	CommandName,
	Manager<ObjectLikeConstraint>
> = {};
