import { Listr, PRESET_TIMER } from "listr2";

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
				collectErrors: "minimal",
				exitOnError: true,
				rendererOptions: {
					collapseErrors: false,
					formatOutput: "wrap",
					showErrorMessage: true,
					timer: PRESET_TIMER,
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

			try {
				await receiver.run();
			} catch (error) {
				if (error instanceof Error && error.stack) {
					console.error("\x1b[31m");
					console.error(error.stack);
					console.error("\x1b[0m");
				}

				throw error;
			}
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
