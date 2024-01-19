import type { ClipperConfig, DatabaseInfo } from 'free-clipper-core'
import { CLIP_DATABASE_INFO, NOTION_KEY } from 'free-clipper-core'

const configElement = document.createElement('clipper-config') as ClipperConfig
document.body.appendChild(configElement)
configElement.getNotionKey = getNotionKey
configElement.setNotionKey = setNotionKey
configElement.getClipDatabaseInfo = getClipDatabaseInfo
configElement.setClipDatabaseInfo = setClipDatabaseInfo
configElement.handleReset = handleReset
document.body.appendChild(configElement)

const toasterElement = document.createElement('clipper-ui-toaster')
document.body.appendChild(toasterElement)

function setNotionKey(key: string) {
  localStorage.setItem(NOTION_KEY, key)
}

function getNotionKey() {
  return localStorage.getItem(NOTION_KEY)
}

function getClipDatabaseInfo() {
  const res = localStorage.getItem(CLIP_DATABASE_INFO)
  if (res)
    return JSON.parse(res) as DatabaseInfo
}

function setClipDatabaseInfo(databaseInfo: DatabaseInfo) {
  localStorage.setItem(CLIP_DATABASE_INFO, JSON.stringify(databaseInfo))
}

function handleReset() {
  localStorage.removeItem(NOTION_KEY)
  localStorage.removeItem(CLIP_DATABASE_INFO)
}
