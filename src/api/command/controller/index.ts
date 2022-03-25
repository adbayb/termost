import {
	CommandName,
	Context,
	EmptyObject,
	ObjectLikeConstraint,
} from "../../../types";
import { createQueue } from "./queue";

export type CommandController<
	Values extends ObjectLikeConstraint = EmptyObject
> = {
	addValue<Key extends keyof Values>(key: Key, value: Values[Key]): void;
	addOptionDescription(key: string, description: string): void;
	addInstruction(instruction: Instruction): void;
	/**
	 * Enables a command by iterating over instructions and executing them
	 */
	enable(): Promise<void>;
	getContext(rootCommandName: CommandName): Context<Values>;
	getMetadata(rootCommandName: CommandName): CommandMetadata;
};

export const getCommandController = <Values extends ObjectLikeConstraint>(
	name: CommandName
) => {
	const controller = commandControllerCollection[name];

	if (!controller) {
		throw new Error(
			`No controller has been set for the \`${name}\` command.\nHave you run the \`termost\` constructor?`
		);
	}

	return controller as CommandController<Values>;
};

export const createCommandController = <Values extends ObjectLikeConstraint>(
	name: CommandName,
	description: CommandMetadata["description"]
) => {
	const instructions = createQueue<Instruction>();
	const context = {
		command: name,
		values: {},
	} as Context<Values>;
	const metadata: CommandMetadata = {
		description,
		options: {
			"-h, --help": "Display the help center",
			"-v, --version": "Print the version",
		},
	};

	const controller: CommandController<Values> = {
		addOptionDescription(key, description) {
			metadata.options[key] = description;
		},
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
		getContext(rootCommandName) {
			// @note: By design, global values are accessible to subcommands
			// Consequently, root command values are merged with the current command ones:
			if (name !== rootCommandName) {
				const rootController = getCommandController(rootCommandName);
				const globalContext =
					rootController.getContext(rootCommandName);

				context.values = {
					...globalContext.values,
					...context.values,
				};
			}

			return context;
		},
		getMetadata(rootCommandName) {
			if (name !== rootCommandName) {
				const globalMetadata =
					getCommandController(rootCommandName).getMetadata(
						rootCommandName
					);

				metadata.options = {
					...globalMetadata.options,
					...metadata.options,
				};
			}

			return metadata;
		},
	};

	commandDescriptionCollection[name] = description;
	commandControllerCollection[name] = controller;

	return controller;
};

export const getCommandDescriptionCollection = () => {
	return commandDescriptionCollection;
};

type CommandMetadata = {
	description: string;
	options: Record<string, string>;
};

type Instruction = () => Promise<void>;

const commandControllerCollection: Record<CommandName, CommandController> = {};
const commandDescriptionCollection: Record<
	CommandName,
	CommandMetadata["description"]
> = {};
