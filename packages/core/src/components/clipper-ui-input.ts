import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'

@customElement('clipper-ui-input')
export class ClipperUiInput extends LitElement {
  @property({ type: String }) label = null
  @property({ type: String }) value = ''
  @property({ type: Function }) onChangeValue: (...args: any) => any = () => {}

  handleInput(e: InputEvent) {
    const target = e.target as HTMLDivElement
    this.onChangeValue(target.textContent ?? '')
  }

  render() {
    return html`
      <input class='border shadow-sm rounded-md focus:ring-1 p-2 w-full text-sm whitespace-nowrap overflow-hidden' @input=${this.handleInput} >
        ${this.value}
      </input>
    `
  }

  static styles = unsafeCSS(tailwindInjectedCss)
}
