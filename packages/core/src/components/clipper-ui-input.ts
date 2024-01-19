import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'

@customElement('clipper-ui-input')
export class ClipperUiInput extends LitElement {
  @property({ type: String }) label = null
  @property({ type: String }) value = ''
  @property({ type: Function }) onChangeValue: (...args: any) => any = () => {}

  handleInput(e: InputEvent) {
    const target = e.target as HTMLInputElement
    this.onChangeValue(target.value ?? '')
  }

  render() {
    return html`
      <input class='border shadow-sm rounded-md focus:ring-1 p-2 w-full text-sm whitespace-nowrap overflow-hidden' @input=${this.handleInput} value=${this.value} />
    `
  }

  static styles = unsafeCSS(tailwindInjectedCss)
}
