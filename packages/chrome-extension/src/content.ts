import type { DomInspector } from 'free-clipper-core'
import { getClipDatabaseInfo, getNotionKey } from './store'

const domInspectElement = document.createElement('dom-inspector') as DomInspector
domInspectElement.getNotionKey = getNotionKey
domInspectElement.getClipDatabaseInfo = getClipDatabaseInfo
document.body.appendChild(domInspectElement)

const toasterElement = document.createElement('clipper-ui-toaster')
document.body.appendChild(toasterElement)
