import { richTextHandler } from "./RichTextHandler";

export function bulletedListHandler (e: HTMLElement) {
  return {
    bulleted_list_item: {
      rich_text: richTextHandler(e)
    }
  }
}