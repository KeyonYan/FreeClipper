import type { ClipperConfig } from 'free-clipper-core'
import { getClipDatabaseInfo, getNotionKey, handleReset, setClipDatabaseInfo, setNotionKey } from './store'

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
