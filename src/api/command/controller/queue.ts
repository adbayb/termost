export const createQueue = <Item>() => {
	const items: Array<Item> = [];

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
