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
				collectErrors: true,
				exitOnError: true,
				rendererOptions: {
					collapseErrors: false,
					formatOutput: "wrap",
					showErrorMessage: false,
					timer: PRESET_TIMER,
				},
			})
		: undefined;

	return async function execute(context, argv) {
		let value: unknown;

		if (receiver) {
			receiver.add({
				...(label && {
					title: typeof label === "function" ? label(context, argv) : label,
				}),
				task: async () => {
					// oxlint-disable-next-line @typescript-eslint/no-unsafe-return
					return (value = await handler(context, argv));
				},
			});

			await receiver.run();
		} else {
			value = await handler(context, argv);
		}

		return { key, value };
	};
};

export type TaskParameters<
	Values extends ObjectLikeConstraint,
	Key extends keyof Values | undefined = undefined,
> = InstructionParameters<
	Values,
	{
		label?: Label<Values>;
		handler: (
			context: Context<Values>,
			argv: ArgumentValues,
		) => Key extends keyof Values ? Promise<Values[Key]> | Values[Key] : Promise<void> | void;
	} & Partial<InstructionKey<Key>>
>;
