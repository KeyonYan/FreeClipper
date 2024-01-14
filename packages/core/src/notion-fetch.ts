import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { getClipDatabaseInfo, getNotionKey } from './config'

const LIMIT_BLOCK_COUNT = 50

export function getClient() {
  const notion = new Client({
    auth: getNotionKey() ?? '',
    fetch: (url: string, init) => {
      return fetch(url.replace('https://api.notion.com/v1', 'http://localhost:5173/notionapi'), init)
    },
  })
  return notion
}

export async function uploadToNotion(blocks: any[]) {
  try {
    const clipDatabase = getClipDatabaseInfo()
    const resp = await addNotionPageToDatabase(
      clipDatabase?.id ?? '',
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
