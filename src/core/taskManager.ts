import { Queue } from "./dataStructure";

export class TaskManager {
	#queue: Queue<TaskManagerItem> = new Queue();

	register(item: TaskManagerItem) {
		return this.#queue.queue(item);
	}

	unregister() {
		return this.#queue.enqueue();
	}

	async start() {
		let promise: TaskManagerItem | undefined;

		while ((promise = this.unregister())) {
			await promise();
		}
	}

	stop() {
		this.#queue.clear();
	}
}

type TaskManagerItem = () => Promise<void>;
