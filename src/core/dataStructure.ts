export class Queue<Item> implements DataStructure {
	#data: Array<Item> = [];

	queue(item: Item) {
		this.#data.push(item);
	}

	enqueue() {
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

export class Dictionary<Key extends string = string, Value = unknown>
	implements DataStructure {
	#data: Partial<Record<Key, Value>> = {};
	#size = 0;

	get(key: Key) {
		return this.#data[key];
	}

	set(key: Key, value: Value) {
		this.#data[key] = value;
		this.#size++;
	}

	remove(key: Key) {
		if (!(key in this.#data)) {
			return undefined;
		}

		const { [key]: removedKey, ...newData } = this.#data;

		this.#data = newData as Record<Key, Value>;
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
