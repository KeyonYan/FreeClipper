import { DomInspectElement } from 'free-clipper-core'

window.customElements.define('dom-inspector-component', DomInspectElement)

const domInspectElement = document.createElement('dom-inspector-component')
document.body.appendChild(domInspectElement)
