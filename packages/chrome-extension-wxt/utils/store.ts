import { storage } from 'wxt/storage'

export async function getNotionKey() {
  const res = await storage.getItem<string>('local:freeclipper:notionKey')
  return res
}

export async function getClipDatabaseInfo() {
  const res = await storage.getItem<any>('local:freeclipper:clipDatabaseInfo')
  return res
}
