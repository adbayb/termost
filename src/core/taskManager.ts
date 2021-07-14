import { Queue } from "./dataStructure";

export class TaskManager {
	#queue: Queue<TaskManagerItem> = new Queue();

	register(item: TaskManagerItem) {
		return this.#queue.enqueue(item);
	}

	unregister() {
		return this.#queue.dequeue();
	}

	async start() {
		while (!this.#queue.isEmpty()) {
			const task = this.unregister();

			if (task) {
				await task();
			}
		}
	}

	stop() {
		this.#queue.clear();
	}
}

type TaskManagerItem = () => Promise<void>;
