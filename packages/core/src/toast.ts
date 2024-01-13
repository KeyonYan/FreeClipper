import { LitElement, css, html, unsafeCSS } from 'lit'
import { query, state } from 'lit/decorators.js'
import tailwindInjectedCss from './tailwind.out.css?raw'

interface ToastData {
  key: string
  message: string
  url?: string
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
          ({ message, url }) =>
            html`
            <div class=" hover:shadow-lg transition-all duration-400 items-center justify-center p-2 flex flex-row gap-2 rounded-lg shadow-md bg-white text-black">
              <div>${message}</div>
              ${url && html`
                <a href=${url}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 1C4.22386 1 4 1.22386 4 1.5C4 1.77614 4.22386 2 4.5 2H12V13H4.5C4.22386 13 4 13.2239 4 13.5C4 13.7761 4.22386 14 4.5 14H12C12.5523 14 13 13.5523 13 13V2C13 1.44772 12.5523 1 12 1H4.5ZM6.60355 4.89645C6.40829 4.70118 6.09171 4.70118 5.89645 4.89645C5.70118 5.09171 5.70118 5.40829 5.89645 5.60355L7.29289 7H0.5C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H7.29289L5.89645 9.39645C5.70118 9.59171 5.70118 9.90829 5.89645 10.1036C6.09171 10.2988 6.40829 10.2988 6.60355 10.1036L8.85355 7.85355C9.04882 7.65829 9.04882 7.34171 8.85355 7.14645L6.60355 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>  
                </a>
                `
              }
            </div>`,
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
  const updateToast = (key: string, message: string, url?: string, duration?: number) => {
    const newToast = { key, message, url, duration: duration || 3000 }
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
