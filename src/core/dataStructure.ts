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

export class Dictionary<Value = unknown> implements DataStructure {
	#data: Record<string, Value> = {};
	#size = 0;

	get(key: string) {
		return this.#data[key];
	}

	set(key: string, value: Value) {
		this.#data[key] = value;
		this.#size++;
	}

	remove(key: string) {
		if (!(key in this.#data)) {
			return undefined;
		}

		const { [key]: removedKey, ...newData } = this.#data;

		this.#data = newData;
		this.#size--;

		return removedKey;
	}

	keys() {
		return Object.keys(this.#data);
	}

	values() {
		return this.#data;
	}

	clear() {
		this.#data = {};
	}

	size() {
		return this.#size;
	}
}

interface DataStructure {
	clear(): void;
	size(): number;
}
