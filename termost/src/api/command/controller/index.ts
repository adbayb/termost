import type {
	CommandName,
	Context,
	EmptyObject,
	ObjectLikeConstraint,
} from "../../../types";
import { createQueue } from "./queue";

export type CommandController<
	Values extends ObjectLikeConstraint = EmptyObject,
> = {
	addInstruction: (instruction: Instruction) => void;
	addOptionDescription: (key: string, description: string) => void;
	addValue: <Key extends keyof Values>(key: Key, value: Values[Key]) => void;
	/**
	 * Enables a command by iterating over instructions and executing them.
	 */
	enable: () => Promise<void>;
	getContext: (rootCommandName: CommandName) => Context<Values>;
	getMetadata: (rootCommandName: CommandName) => CommandMetadata;
};

export const getCommandController = <Values extends ObjectLikeConstraint>(
	name: CommandName,
) => {
	const controller = commandControllerCollection[name];

	if (!controller) {
		throw new Error(
			`No controller has been set for the \`${name}\` command.\nHave you run the \`termost\` constructor?`,
		);
	}

	return controller as CommandController<Values>;
};

export const createCommandController = <Values extends ObjectLikeConstraint>(
	name: CommandName,
	description: CommandMetadata["description"],
) => {
	const instructions = createQueue<Instruction>();
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	let context = {} as Context<Values>;

	const metadata: CommandMetadata = {
		description,
		options: {
			"-h, --help": "Display the help center",
			"-v, --version": "Print the version",
		},
	};

	const controller: CommandController<Values> = {
		addInstruction(instruction) {
			instructions.enqueue(instruction);
		},
		addOptionDescription(key, value) {
			metadata.options[key] = value;
		},
		addValue(key, value) {
			context[key] = value;
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
			/**
			 * By design, global values are accessible to subcommands.
			 * Consequently, root command values are merged with the current command ones.
			 */
			if (name !== rootCommandName) {
				const rootController = getCommandController(rootCommandName);

				const globalContext =
					rootController.getContext(rootCommandName);

				context = {
					...globalContext,
					...context,
				};
			}

			return context;
		},
		getMetadata(rootCommandName) {
			if (name !== rootCommandName) {
				const globalMetadata =
					getCommandController(rootCommandName).getMetadata(
						rootCommandName,
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

const commandControllerCollection: Record<
	CommandName,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	CommandController<any>
> = {};

const commandDescriptionCollection: Record<
	CommandName,
	CommandMetadata["description"]
> = {};
