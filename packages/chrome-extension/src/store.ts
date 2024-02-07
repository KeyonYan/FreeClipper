import { CLIP_DATABASE_INFO, NOTION_KEY } from 'free-clipper-core'
import type { DatabaseInfo } from 'free-clipper-core'

export function setNotionKey(key: string) {
  localStorage.setItem(NOTION_KEY, key)
}

export function getNotionKey() {
  return localStorage.getItem(NOTION_KEY)
}

export function getClipDatabaseInfo() {
  const res = localStorage.getItem(CLIP_DATABASE_INFO)
  if (res)
    return JSON.parse(res) as DatabaseInfo
}

export function setClipDatabaseInfo(databaseInfo: DatabaseInfo) {
  localStorage.setItem(CLIP_DATABASE_INFO, JSON.stringify(databaseInfo))
}

export function handleReset() {
  localStorage.removeItem(NOTION_KEY)
  localStorage.removeItem(CLIP_DATABASE_INFO)
}
