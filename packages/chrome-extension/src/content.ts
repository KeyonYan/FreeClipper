import { DomInspector } from 'free-clipper-core'

window.customElements.define('dom-inspector', DomInspector)

const domInspectElement = document.createElement('dom-inspector')
document.body.appendChild(domInspectElement)
