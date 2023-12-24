export const createQueue = <Item>() => {
	const items: Item[] = [];

	return {
		dequeue() {
			return items.shift();
		},
		enqueue(item: Item) {
			items.push(item);
		},
		isEmpty() {
			return items.length === 0;
		},
	};
};
