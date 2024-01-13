import { LitElement, css, html, unsafeCSS } from 'lit'
import { query, state } from 'lit/decorators.js'
import tailwindInjectedCss from './tailwind.out.css?raw'

interface ToastData {
  key: string
  message: string
  duration?: number
}

export class Toaster extends LitElement {
  @state()
  toasts: ToastData[] = []

  static userStyles = css`
  `
  render() {
    return html`
      <div id="toast-container" class="fixed top-1 w-screen z-[1000] flex flex-col gap-2 justify-center items-center">
        ${this.toasts.map(
          toast =>
            html`<div class="hover:scale-110 duration-500 p-2 rounded-lg shadow-md bg-white text-black">${toast.message}</div>`,
        )}
      </div>
      `
  }

  static styles = [this.userStyles, unsafeCSS(tailwindInjectedCss)]
}

export function useToast(toaster: Toaster) {
  const showToast = (key: string, message: string) => {
    const newToast = { key, message }
    toaster.toasts = [...toaster.toasts, newToast]
  }
  const updateToast = (key: string, message: string, duration?: number) => {
    const newToast = { key, message, duration: duration || 3000 }
    toaster.toasts = toaster.toasts.map((toast) => {
      if (toast.key === key) {
        setTimeout(() => {
          toaster.toasts = toaster.toasts.filter(toast => toast.key !== key)
        }, newToast.duration)
        return newToast
      }
      return toast
    })
  }
  return { showToast, updateToast }
}

customElements.define('loading-toaster', Toaster)
