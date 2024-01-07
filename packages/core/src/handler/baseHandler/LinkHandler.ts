export function linkHandler(e: HTMLLinkElement) {
  let link = e.getAttribute('href') ?? null
  const content = e.textContent ?? link
  return {
    paragraph: {rich_text: [{ type: 'text', text: { content: content, link: {url: link} }}]}
  }
}