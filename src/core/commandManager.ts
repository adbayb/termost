import { Queue } from "./dataStructure";

export class CommandManager {
	#queue: Queue<CommandManagerItem> = new Queue();

	register(item: CommandManagerItem) {
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

type CommandManagerItem = () => Promise<void>;
