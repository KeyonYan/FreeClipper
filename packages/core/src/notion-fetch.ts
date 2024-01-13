import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'

const auth = '' // TODO
const databaseId = '' // TODO
const notion = new Client({
  auth,
  fetch: (url: string, init) => {
    return fetch(url.replace('https://api.notion.com/v1', 'http://localhost:5173/notionapi'), init)
  },
})
const LIMIT_BLOCK_COUNT = 50

export async function uploadToNotion(blocks: any[]) {
  try {
    const resp = await addNotionPageToDatabase(
      databaseId,
      { title: { title: [{ text: { content: document.title } }] } },
      blocks.slice(0, LIMIT_BLOCK_COUNT),
    )
    if (blocks.length > LIMIT_BLOCK_COUNT) {
      for (let i = LIMIT_BLOCK_COUNT; i < blocks.length; i += LIMIT_BLOCK_COUNT)
        await appendToNotionPage(resp.id, blocks.slice(i, i + LIMIT_BLOCK_COUNT))
    }
    return { success: true, url: resp.url }
  }
  catch (e) {
    return { success: false, message: e }
  }
}

export async function addNotionPageToDatabase(databaseId: string, pageProperties: any, blocks?: any[]) {
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: pageProperties,
    children: blocks,
  })
  return newPage as PageObjectResponse
}

export async function appendToNotionPage(pageId: string, blocks: any[]) {
  await notion.blocks.children.append({
    block_id: pageId,
    children: blocks,
  })
}
