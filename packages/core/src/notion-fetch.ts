import { Client } from '@notionhq/client'

const auth = '' // TODO
const pageId = '' // TODO
const LIMIT_BLOCK_COUNT = 50
export async function uploadToNotion(blocks: any[]) {
  const notion = new Client({
    auth,
    fetch: (url: string, init) => {
      return fetch(url.replace('https://api.notion.com/v1', 'http://localhost:5173/notionapi'), init)
    },
  })
  for (let i = 0; i < blocks.length; i += LIMIT_BLOCK_COUNT) {
    const newHeadingResponse = await notion.blocks.children.append({
      block_id: pageId,
      children: blocks.slice(i, i + LIMIT_BLOCK_COUNT),
    })
  }
}
