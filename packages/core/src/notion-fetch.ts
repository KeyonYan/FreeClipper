import { Client } from '@notionhq/client'
import { type PageObjectResponse, search } from '@notionhq/client/build/src/api-endpoints'
import { property } from 'lit/decorators'
import { CLIP_DATABASE_ID, NOTION_KEY } from './config'

// const auth = 'secret_jzho2L9xxhYVj9ZFYcqIDWqnj4urNh6RgQN72gZfBdC' // TODO
// const databaseId = '63b4ceb167134a799c8d3ff6dd715a99' // TODO

// const auth = localStorage.getItem(NOTION_KEY) ?? ''
// const databaseId = localStorage.getItem(CLIP_DATABASE_ID) ?? ''

const LIMIT_BLOCK_COUNT = 50

export function getClient() {
  const notion = new Client({
    auth: localStorage.getItem(NOTION_KEY) ?? '',
    fetch: (url: string, init) => {
      return fetch(url.replace('https://api.notion.com/v1', 'http://localhost:5173/notionapi'), init)
    },
  })
  return notion
}

export async function uploadToNotion(blocks: any[]) {
  try {
    const resp = await addNotionPageToDatabase(
      localStorage.getItem(CLIP_DATABASE_ID) ?? '',
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
  const newPage = await getClient().pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: pageProperties,
    children: blocks,
  })
  return newPage as PageObjectResponse
}

export async function appendToNotionPage(pageId: string, blocks: any[]) {
  await getClient().blocks.children.append({
    block_id: pageId,
    children: blocks,
  })
}

export async function searchNotionDatabase(title?: string) {
  const searchParam: any = {
    filter: {
      value: 'database',
      property: 'object',
    },
    sort: {
      direction: 'ascending',
      timestamp: 'last_edited_time',
    },
  }
  if (title)
    searchParam.query = title
  const resp = await getClient().search(searchParam)
  return resp
}
