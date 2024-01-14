import { createApp } from 'vue'
import { ConfigComponent, DomInspectElement, NOTION_KEY } from 'free-clipper-core'
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

window.customElements.define('dom-inspector-component', DomInspectElement)
window.customElements.define('clip-config', ConfigComponent)

const domInspectElement = document.createElement('dom-inspector-component') as DomInspectElement
domInspectElement.getNotionKey = getNotionKey
domInspectElement.getClipDatabaseInfo = getClipDatabaseInfo
document.body.appendChild(domInspectElement)

const configElement = document.createElement('clip-config') as ConfigComponent
configElement.getNotionKey = getNotionKey
configElement.setNotionKey = setNotionKey
configElement.getClipDatabaseInfo = getClipDatabaseInfo
configElement.setClipDatabaseInfo = setClipDatabaseInfo
document.body.appendChild(configElement)

export function getNotionKey() {
  return GM_getValue(NOTION_KEY, '')
}

export function setNotionKey(key: string) {
  return GM_setValue(NOTION_KEY, key)
}

export function getClipDatabaseInfo() {
  return GM_getValue('clipDatabaseInfo', null)
}

export function setClipDatabaseInfo(databaseInfo: DatabaseInfo) {
  return GM_setValue('clipDatabaseInfo', databaseInfo)
}
