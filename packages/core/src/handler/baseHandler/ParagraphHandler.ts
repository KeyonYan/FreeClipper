import { richTextHandler } from "./RichTextHandler";

export function paragraphHandler(e: HTMLParagraphElement) {
  return {
    paragraph: {rich_text: richTextHandler(e)}
  }
}