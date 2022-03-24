import { Queue } from "./queue";

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
