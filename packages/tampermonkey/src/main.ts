import { createApp } from 'vue'
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
