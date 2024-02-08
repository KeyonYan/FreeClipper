import { uploadToNotion } from 'free-clipper-core-react'

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id })
})

browser.runtime.onMessage.addListener(async (message: any) => {
  const { blocks, notionKey, clipDatabaseId, title } = JSON.parse(message)
  console.log('blocks', blocks)
  console.log('notionKey', notionKey)
  console.log('clipDatabaseId', clipDatabaseId)
  const uploadRes = await uploadToNotion(blocks, notionKey, clipDatabaseId, title)
  return uploadRes
})
