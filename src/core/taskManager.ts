import { Queue } from "./queue";

export class TaskManager {
	#queue: Queue<Task> = new Queue();

	register(item: Task) {
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

type Task = () => Promise<void>;
