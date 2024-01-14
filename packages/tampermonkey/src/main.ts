import { createApp } from 'vue'

// eslint-disable-next-line ts/consistent-type-imports
import { CLIP_DATABASE_INFO, ClipperConfig, ClipperUiToaster, DomInspector, NOTION_KEY } from 'free-clipper-core'
import type { DatabaseInfo } from 'free-clipper-core'
import { GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client'
import App from './App.vue'
import 'virtual:uno.css'

console.log('hello world')

createApp(App).mount(
  (() => {
    const app = document.createElement('div')
    app.id = 'float-app'
    document.body.append(app)
    return app
  })(),
)

// window.customElements.define('dom-inspector-component', DomInspectElement)
// window.customElements.define('clip-config', ConfigComponent)

const domInspectElement = document.createElement('dom-inspector') as DomInspector
domInspectElement.getNotionKey = getNotionKey
domInspectElement.getClipDatabaseInfo = getClipDatabaseInfo
document.body.appendChild(domInspectElement)

const configElement = document.createElement('clipper-config') as ClipperConfig
configElement.getNotionKey = getNotionKey
configElement.setNotionKey = setNotionKey
configElement.getClipDatabaseInfo = getClipDatabaseInfo
configElement.setClipDatabaseInfo = setClipDatabaseInfo
configElement.handleReset = handleReset
document.body.appendChild(configElement)

const toasterElement = document.createElement('clipper-ui-toaster')
document.body.appendChild(toasterElement)

export function getNotionKey() {
  return GM_getValue(NOTION_KEY, '')
}

export function setNotionKey(key: string) {
  return GM_setValue(NOTION_KEY, key)
}

export function getClipDatabaseInfo() {
  return GM_getValue(CLIP_DATABASE_INFO, null)
}

export function setClipDatabaseInfo(databaseInfo: DatabaseInfo) {
  return GM_setValue(CLIP_DATABASE_INFO, databaseInfo)
}

export function handleReset() {
  GM_setValue(NOTION_KEY, null)
  GM_setValue(CLIP_DATABASE_INFO, null)
}
