import type { DatabaseInfo } from 'free-clipper-core-react'
import { storage } from 'wxt/storage'

export async function getNotionKey() {
  const res = await storage.getItem<string>('local:freeclipper:notionKey')
  return res
}

export async function getClipDatabaseInfo() {
  const res = await storage.getItem<DatabaseInfo>('local:freeclipper:clipDatabaseInfo')
  return res
}

export async function setNotionKey(key: string) {
  const res = await storage.setItem<string>('local:freeclipper:notionKey', key)
  return res
}

export async function setClipDatabaseInfo(info: DatabaseInfo) {
  const res = await storage.setItem<DatabaseInfo>('local:freeclipper:clipDatabaseInfo', info)
  return res
}

export async function getModeConfig() {
  const res = await storage.getItem<{ [key: string]: boolean }>('local:freeclipper:modeConfig')
  console.log('getModeConfig', res)
  return res
}

export async function setModeConfig(modeConfig: { [key: string]: boolean }) {
  const res = await storage.setItem<{ [key: string]: boolean }>('local:freeclipper:modeConfig', modeConfig)
  console.log('setModeConfig', res)
  return res
}
