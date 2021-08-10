import { DataStructure } from "../types";

class Queue<Item> implements DataStructure {
	#data: Array<Item> = [];

	enqueue(item: Item) {
		this.#data.push(item);
	}

	dequeue() {
		return this.#data.shift();
	}

	isEmpty() {
		return this.#data.length === 0;
	}

	clear() {
		this.#data = [];
	}

	size() {
		return this.#data.length;
	}
}

export class AsyncQueue extends Queue<() => Promise<void>> {
	async traverse() {
		while (!this.isEmpty()) {
			const task = this.dequeue();

			if (task) {
				await task();
			}
		}
	}
}
