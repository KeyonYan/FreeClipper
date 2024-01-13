import { LitElement, css, html, unsafeCSS } from 'lit'
import { property } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'

export class CustomInput extends LitElement {
  @property({ type: String }) label = null
  @property({ type: String }) value = ''
  @property({ type: Function }) onChangeValue: any

  handleInput(e: InputEvent) {
    const target = e.target as HTMLDivElement
    this.onChangeValue(target.textContent ?? '')
  }

  static userStyles = css``
  render() {
    return html`
      <div class='border shadow-sm rounded-md focus:ring-1 p-2 w-full text-sm whitespace-nowrap overflow-hidden' contenteditable="true" @input=${this.handleInput} >
        ${this.value}
      </div>
    `
  }

  static styles = [this.userStyles, unsafeCSS(tailwindInjectedCss)]
}
