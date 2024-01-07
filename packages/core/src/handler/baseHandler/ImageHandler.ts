export function imageHandler(e: HTMLImageElement) {
  let src = e.src
  if (src.startsWith('data:image')) {
    src = e.getAttribute('data-actualsrc') ?? ''
  }
  return {
    image: {
      external: {
        url: src
      }
    }
  }
}