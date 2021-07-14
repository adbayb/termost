// @todo: rename FluentPlugin? Or FluentComponent?
export interface Plugin {
	execute(): Promise<any>;
	key(): PluginCommonProperties["key"];
}

export interface PluginCommonProperties {
	key: string;
	label: string;
}

/*
class FluentAsk<Item> {
	constructor(public item: Item) {}

	ask(isOk: boolean) {
		return this.item;
	}
}

class Host {
	ask = new FluentAsk(this).ask;
}

new Host().ask(true).ask(false);
*/
