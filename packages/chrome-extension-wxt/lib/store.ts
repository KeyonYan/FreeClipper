import { storage } from 'wxt/storage'

export async function getNotionKey() {
  const res = await storage.getItem<string>('local:freeclipper:notionKey')
  return res
}

export async function getClipDatabaseInfo() {
  const res = await storage.getItem<any>('local:freeclipper:clipDatabaseInfo')
  return res
}

export async function setNotionKey(key: string) {
  const res = await storage.setItem<string>('local:freeclipper:notionKey', key)
  return res
}

export async function setClipDatabaseInfo(info: string) {
  const res = await storage.setItem<any>('local:freeclipper:clipDatabaseInfo', info)
  return res
}
