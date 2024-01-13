import { createApp } from 'vue'
import { ConfigComponent, DomInspectElement } from 'free-clipper-core'
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

const domInspectElement = document.createElement('dom-inspector-component')
document.body.appendChild(domInspectElement)

const configElement = document.createElement('clip-config')
document.body.appendChild(configElement)
