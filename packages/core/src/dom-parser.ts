const whiteList = ['#text', 'P', 'A', 'IMG', 'BR']

export function parse2Block(e: HTMLElement) {
  const elements: any[] = []
  function traversalChildren(e: HTMLElement) {
    if (e instanceof HTMLParagraphElement) {
      elements.push({
        type: 'paragraph', 
        paragraph: {rich_text: parseRichText(e)}
      })
      return elements
    } else if (e instanceof HTMLImageElement) {
      elements.push({
        type: 'image',
        external: {
          url: e.src
        }
      })
      return elements
    } else if (e.tagName === 'H1') {
      elements.push({
        type: `heading_1`,
        heading_1: {rich_text: parseRichText(e)}
      })
      return elements
    } else if (e.tagName === 'H2') {
      elements.push({
        type: `heading_2`,
        heading_2: {rich_text: parseRichText(e)}
      })
      return elements
    } else if (e.tagName === 'H3') {
      elements.push({
        type: `heading_3`,
        heading_3: {rich_text: parseRichText(e)}
      })
      return elements
    } else if (e.tagName === 'BLOCKQUOTE') {
      elements.push({
        type: 'quote',
        quote: {rich_text: parseRichText(e)}
      })
      return elements
    } else if (e.tagName === 'BR') {
      elements.push({
        type: 'paragraph',
        paragraph: {rich_text: [{type: 'text', text: {content: '\n'}}]}
      })
      return elements
    } else if (e.tagName === 'A') {
      elements.push({
        type: 'link_preview',
        link_preview: {url: e.getAttribute('href')!}
      })
      return elements
    }
    const children = e.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      traversalChildren(child as HTMLElement)
    }
  }
  function parseRichText(e: HTMLElement): any[] | undefined {
    const nodes = e.childNodes
    if (!nodes || nodes.length <= 0) {
      if (!whiteList.includes(e.nodeName)) return
      let content = '', link = null
      if (e.nodeName === '#text') {
        content = e.textContent ?? ''
        if (e.parentElement!.tagName === 'A') {
          link = e.parentElement!.getAttribute('href')
        }
      } else if (e.nodeName === 'BR') {
        content = '\n'
      }
      return [{ type: 'text', text: { content: content, link: link }}]
    }
    let texts: any[] = []
    for (let i = 0; i < nodes.length; i++) {
      const child = nodes[i]
      const text = parseRichText(child as HTMLElement)
      if (text) {
        texts = [...texts, ...text]
      }
    }
    return texts
  }
  traversalChildren(e)
  return elements
}