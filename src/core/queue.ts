import { DataStructure } from "./types";

export class Queue<Item> implements DataStructure {
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
