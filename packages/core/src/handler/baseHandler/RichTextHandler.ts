import { linkHandler } from "./LinkHandler"

const whiteList = ['#text', 'P', 'A', 'IMG', 'BR', 'B']

function textHandler(e: HTMLElement) {
  if (!whiteList.includes(e.nodeName)) return
  if (e.textContent === '') return
  let content = ''
  if (e.nodeName === '#text') {
    content = e.textContent ?? ''
  } else if (e.nodeName === 'BR') {
    content = '\n'
  }
  return {
    text: {
      content: content,
    },
  }
}

function textLinkHandler(e: HTMLElement) {
  const textLink: any = {
    text: {
      content: e.textContent,
    }
  }
  const url = e.getAttribute('href')
  if (url) {
    textLink.text.link = { url: url}
  }
  return textLink
}

// 设置文本样式
function annotationsHandler(annotations: any, e: HTMLElement) {
  const newAnnotations = Object.assign({}, annotations)
  if (e.tagName === 'B') {
    newAnnotations.bold = true
  } else if (e.tagName === 'CODE') {
    newAnnotations.code = true
  } else if (e.tagName === 'I') {
    newAnnotations.italic = true
  }
  
  return newAnnotations
}

export function richTextHandler(e: HTMLElement, annotations?: any): any[] | undefined {
  const nodes = e.childNodes
  if (!nodes || nodes.length <= 0) {
    const text: any = textHandler(e)
    if (text) {
      if (annotations) {
        text.annotations = annotations
      }
      return [text]
    }
    return
  } else if (e.tagName === 'A') {
    const text: any = textLinkHandler(e)
    if (text) {
      if (annotations) {
        text.annotations = annotations
      }
      return [text]
    }
    return
  }

  let texts: any[] = []
  if (!annotations) {
    annotations = {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default'
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    const child = nodes[i]
    const newAnnotations = annotationsHandler(annotations, e)
    const text = richTextHandler(child as HTMLElement, newAnnotations)
    if (!text) continue
    texts = [...texts, ...text]
  }
  return texts
}