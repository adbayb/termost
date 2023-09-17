export const createQueue = <Item>() => {
	const items: Item[] = [];

	return {
		enqueue(item: Item) {
			items.push(item);
		},
		dequeue() {
			return items.shift();
		},
		isEmpty() {
			return items.length === 0;
		},
	};
};
