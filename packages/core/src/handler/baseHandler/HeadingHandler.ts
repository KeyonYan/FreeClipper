import { richTextHandler } from "./RichTextHandler"

export function headingHandler(e: HTMLHeadingElement) {
  const res: any = {}
  const level = Number(e.tagName.replace('H', ''))
  const key = 'heading_' + level
  res[key] = {rich_text: richTextHandler(e)}
  return res
}