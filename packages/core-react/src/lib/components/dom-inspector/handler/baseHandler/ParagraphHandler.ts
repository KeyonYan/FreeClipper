import { richTextHandler } from './RichTextHandler'

export function paragraphHandler(e: HTMLParagraphElement) {
  const richText = richTextHandler(e)
  if (richText) {
    return {
      paragraph: { rich_text: richText },
    }
  }
}
