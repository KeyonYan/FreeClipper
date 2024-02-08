import { brHandler } from './baseHandler/BrHandler'
import { bulletedListHandler } from './baseHandler/BulletedListHandler'
import { codeHandler } from './baseHandler/CodeHandler'
import { equationHandler } from './baseHandler/EquationHandler'
import { headingHandler } from './baseHandler/HeadingHandler'
import { imageHandler } from './baseHandler/ImageHandler'
import { linkHandler } from './baseHandler/LinkHandler'
import { numberedListHandler } from './baseHandler/NumberedListHandler'
import { paragraphHandler } from './baseHandler/ParagraphHandler'
import { quoteHandler } from './baseHandler/QuoteHandler'

export function commonHandler(e: HTMLElement) {
  if (e instanceof HTMLParagraphElement) {
    if (e.childElementCount === 1 && e.firstElementChild?.tagName === 'A')
      return linkHandler(e.firstElementChild as HTMLLinkElement)
    return paragraphHandler(e)
  }
  else if (e instanceof HTMLImageElement) {
    return imageHandler(e)
  }
  else if (e instanceof HTMLHeadingElement) {
    return headingHandler(e)
  }
  else if (e.tagName === 'BLOCKQUOTE') {
    return quoteHandler(e)
  }
  else if (e.tagName === 'BR') {
    return brHandler()
  }
  else if (e instanceof HTMLLinkElement) {
    return linkHandler(e)
  }
  else if (e.tagName === 'CODE') {
    return codeHandler(e)
  }
  else if (e.tagName === 'SPAN' && e.getAttribute('data-tex')) {
    return equationHandler(e)
  }
  else if (e.tagName === 'LI') {
    if (e.parentElement?.tagName === 'UL')
      return bulletedListHandler(e)
    else if (e.parentElement?.tagName === 'OL')
      return numberedListHandler(e)
  }
}
