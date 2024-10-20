import { richTextHandler } from "./RichTextHandler";

export function quoteHandler(e: HTMLElement) {
	return {
		quote: { rich_text: richTextHandler(e) },
	};
}
