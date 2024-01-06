
const whiteList = ['#text', 'P', 'A', 'IMG', 'BR']

function elementHandler(e: HTMLElement) {
  if (e instanceof HTMLParagraphElement) {
    if (e.childElementCount === 1 && e.firstElementChild?.tagName === 'A') {
      return linkHandler(e.firstElementChild as HTMLLinkElement)
    }
    return paragraphHandler(e)
  } else if (e instanceof HTMLImageElement) {
    return imageHandler(e)
  } else if (e instanceof HTMLHeadingElement) {
    return headingHanlder(e)
  } else if (e.tagName === 'BLOCKQUOTE') {
    return quoteHandler(e)
  } else if (e.tagName === 'BR') {
    return brHandler()
  } else if (e instanceof HTMLLinkElement) {
    return linkHandler(e)
  } else if (e.tagName === 'CODE') {
    return codeHandler(e)
  } else if (e.tagName === 'SPAN' && e.getAttribute('data-tex')) {
    return equationHandler(e)
  }
  return
}

function equationHandler(e: HTMLElement) {
  return {
    equation: {expression: e.getAttribute('data-tex')}
  }
}

function paragraphHandler(e: HTMLParagraphElement) {
  return {
    paragraph: {rich_text: parseRichText(e)}
  }
}

function imageHandler(e: HTMLImageElement) {
  return {
    image: {
      external: {
        url: e.src
      }
    }
  }
}

function headingHanlder(e: HTMLHeadingElement) {
  const res: any = {}
  const level = Number(e.tagName.replace('H', ''))
  const key = 'heading_' + level
  res[key] = {rich_text: parseRichText(e)}
  return res
}

function quoteHandler(e: HTMLElement) {
  return {
    quote: {rich_text: parseRichText(e)}
  }
}

function brHandler() {
  return {
    paragraph: {rich_text: [{type: 'text', text: {content: '\n'}}]}
  }
}

function linkHandler(e: HTMLLinkElement) {
  const link = e.getAttribute('href') ?? null
  const content = e.textContent ?? link
  console.log("link: ", link)
  return {
    paragraph: {rich_text: [{ type: 'text', text: { content: content, link: {url: link} }}]}
  }
}

function codeHandler(e: HTMLElement) {
  let lang = ''
  e.classList.forEach((className) => {
    if (className.startsWith('language-')) {
      lang = className.replace('language-', '')
    }
  })
  return {
    code: {
      caption: '',
      rich_text: parseRichText(e),
      language: lang,
    }
  }
}

export function parse2Block(e: HTMLElement) {
  const blocks: any[] = []
  function traversalChildren(e: HTMLElement) {
    const block = elementHandler(e)
    if (block) {
      blocks.push(block)
      return
    }
    const children = e.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      traversalChildren(child as HTMLElement)
    }
  }
  
  traversalChildren(e)
  return blocks
}

function parseRichText(e: HTMLElement): any[] | undefined {
  const nodes = e.childNodes
  if (!nodes || nodes.length <= 0) {
    if (!whiteList.includes(e.nodeName)) return
    let text: any = {content: '', link: null}
    if (e.nodeName === '#text') {
      const content = e.textContent ?? ''
      text.content = content
      if (e.parentElement!.tagName === 'A') {
        const link = e.parentElement!.getAttribute('href')
        text['link'] = {}
        text['link']['url'] = link
      }
    } else if (e.nodeName === 'BR') {
      text['content'] = '\n'
    }
    return [{ type: 'text', text: text}]
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