import { richTextHandler } from './RichTextHandler'

export function codeHandler(e: HTMLElement) {
  let lang = ''
  e.classList.forEach((className) => {
    if (className.startsWith('language-'))
      lang = className.replace('language-', '')

    else if (className.startsWith('lang-'))
      lang = className.replace('lang-', '')
  })
  if (lang === '')
    lang = e.getAttribute('data-lang') ?? ''

  lang = lang.toLowerCase()
  if (lang === 'ts')
    lang = 'typescript'
  else if (lang === 'js')
    lang = 'javascript'
  else if (lang === 'text')
    lang = 'plain text'
  return {
    code: {
      rich_text: richTextHandler(e),
      language: lang,
    },
  }
}
