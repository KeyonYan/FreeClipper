import { commonHandler } from "./handler/handler";

export function parse2Block(e: HTMLElement) {
	const blocks: any[] = [];

	function traversalChildren(e: HTMLElement) {
		const block = commonHandler(e);
		if (block) {
			blocks.push(block);
			return;
		}
		const children = e.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			traversalChildren(child as HTMLElement);
		}
	}

	traversalChildren(e);
	return blocks;
}
