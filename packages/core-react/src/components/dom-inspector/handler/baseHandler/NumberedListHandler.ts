import { richTextHandler } from "./RichTextHandler";

export function numberedListHandler(e: HTMLElement) {
	return {
		numbered_list_item: {
			rich_text: richTextHandler(e),
		},
	};
}
