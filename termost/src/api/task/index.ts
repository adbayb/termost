import { Listr } from "listr2";

import type {
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
				...(label && {
					title:
						typeof label === "function"
							? label(context, argv)
							: label,
				}),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				task: async () => (value = await handler(context, argv)),
			});

			await receiver.run();
		}

		return { key, value };
	};
};

export type TaskParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values | undefined = undefined,
> = InstructionParameters<
	Values,
	Partial<InstructionKey<Key>> & {
		label?: Label<Values>;
		handler: (
			context: Context<Values>,
			argv: ArgumentValues,
		) => Key extends keyof Values
			? Promise<Values[Key]> | Values[Key]
			: Promise<void> | void;
	}
>;
