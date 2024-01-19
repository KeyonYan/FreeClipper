import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import tailwindInjectedCss from '../tailwind.out.css?raw'
import OpenIcon from '../assets/open.svg'

interface ToastItem {
  key: string
  message: string
  url?: string
  duration?: number
}

const ELEMENT_NAME = 'clipper-ui-toaster'

@customElement(ELEMENT_NAME)
export class ClipperUiToaster extends LitElement {
  @state()
  toasts: ToastItem[] = []

  showToast = (key: string, message: string, duration?: number) => {
    const newToast = { key, message }
    this.toasts = [...this.toasts, newToast]
    if (duration) {
      setTimeout(() => {
        this.removeToast(key)
      }, duration)
    }
  }

  updateToast = (key: string, message: string, url?: string, duration: number = 3000) => {
    const newToast = { key, message, url, duration }
    this.toasts = this.toasts.map((toast) => {
      if (toast.key === key) {
        setTimeout(() => {
          this.removeToast(key)
        }, newToast.duration)
        return newToast
      }
      return toast
    })
  }

  removeToast = (key: string) => {
    this.toasts = this.toasts.filter((toast) => {
      return toast.key !== key
    })
  }

  renderLink(url?: string) {
    if (!url)
      return nothing
    return html`<a href=${url} class='inline-flex items-center gap-2 justify-center whitespace-nowrap cursor-pointer text-sm font-medium hover:text-blue-900 mx-1 px-1 pt-1 mb-1 border-b-2 border-white hover:border-blue-600 transition-all'>
                  <img src=${OpenIcon}>
                  Open
                </a>
              `
  }

  render() {
    return html`
      <div class="fixed top-5 w-screen z-[2147483647] flex flex-col gap-2 justify-center items-center select-none">
        ${this.toasts.map(
          ({ message, url }) =>
            html`<div class="shadow-lg transition-all duration-400 items-center justify-center px-4 py-2 flex border border-gray-100 flex-row gap-2 rounded-lg bg-white text-black">
                  <div>${message}</div>
                  ${this.renderLink(url)}
                </div>`,
        )}
      </div>
      `
  }

  static styles = unsafeCSS(tailwindInjectedCss)
}

export function useToaster() {
  const toaster = document.querySelector(ELEMENT_NAME) as ClipperUiToaster | undefined
  return toaster
}
