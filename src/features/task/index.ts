import { Listr } from "listr2";
import {
	Context,
	CreateInstruction,
	InstructionKey,
	InstructionParameters,
	Label,
	ObjectLikeConstraint,
} from "../types";
import { exec } from "../../helpers/process";

export const createTask: CreateInstruction<
	TaskParameters<ObjectLikeConstraint, keyof ObjectLikeConstraint>
> = (parameters) => {
	const { key, label, handler } = parameters;
	const receiver = new Listr([], {
		rendererOptions: {
			collapseErrors: false,
			formatOutput: "wrap",
			showErrorMessage: true,
			showTimer: true,
		},
	});

	return async function execute(context) {
		let value: unknown;

		receiver.add({
			title: typeof label === "function" ? label(context) : label,
			task: async () => (value = await handler(context, HELPERS)),
		});

		await receiver.run();

		return { key, value };
	};
};

const HELPERS = {
	exec,
};

export type TaskParameters<
	Values extends ObjectLikeConstraint,
	Key
> = InstructionParameters<Values, Parameters<Values, Key>>;

type Parameters<
	Values extends ObjectLikeConstraint,
	Key
> = Key extends keyof Values
	? Partial<InstructionKey<Key>> & {
			label: Label<Values>;
			handler: (
				context: Context<Values>,
				helpers: typeof HELPERS
			) => Promise<Values[Key]>;
	  }
	: {
			label: Label<Values>;
			handler: (
				context: Context<Values>,
				helpers: typeof HELPERS
			) => void;
	  };
