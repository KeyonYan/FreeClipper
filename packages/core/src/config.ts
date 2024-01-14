export const NOTION_KEY = '__freeclip__key__'
export const CLIP_DATABASE_INFO = '__freeclip__databaseId__'

export function getNotionKey() {
  return localStorage.getItem(NOTION_KEY) ?? ''
}

export function setNotionKey(key: string) {
  localStorage.setItem(NOTION_KEY, key)
}

export interface DatabaseInfo {
  id: string
  name: string
  icon?: any
}

export function getClipDatabaseInfo(): DatabaseInfo | null {
  const databaseInfo = localStorage.getItem(CLIP_DATABASE_INFO)
  if (databaseInfo)
    return JSON.parse(databaseInfo) as DatabaseInfo ?? ''
  return null
}

export function setClipDatabaseInfo(databaseInfo: DatabaseInfo) {
  localStorage.setItem(CLIP_DATABASE_INFO, JSON.stringify(databaseInfo))
}
