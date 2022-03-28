import { Listr } from "listr2";
import {
	ArgumentValues,
	Context,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../../types";

export const createTask: CreateInstruction<
	TaskParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { key, label, handler } = parameters;
	const receiver = label
		? new Listr([], {
				rendererOptions: {
					collapseErrors: false,
					formatOutput: "wrap",
					showErrorMessage: true,
					showTimer: true,
				},
		  })
		: null;

	return async function execute(context, argv) {
		let value: unknown;

		if (!receiver) {
			value = await handler(context, argv);
		} else {
			receiver.add({
				title:
					typeof label === "function" ? label(context, argv) : label,
				task: async () => (value = await handler(context, argv)),
			});

			await receiver.run();
		}

		return { key, value };
	};
};

export type TaskParameters<
	Values extends ObjectLikeConstraint,
	Key
> = InstructionParameters<Values, Parameters<Values, Key>>;

type Parameters<
	Values extends ObjectLikeConstraint,
	Key
> = Key extends keyof Values
	? InstructionKey<Key> & {
			label?: Label<Values>;
			handler: (
				context: Context<Values>,
				argv: ArgumentValues
			) => Promise<Values[Key]> | Values[Key];
	  }
	: {
			label?: Label<Values>;
			handler: (context: Context<Values>, argv: ArgumentValues) => void;
	  };
