import type { PropertyValueMap } from 'lit'
import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'
import { parse2Block } from '../dom-parser'
import { uploadToNotion } from '../notion-fetch'
import type { DatabaseInfo } from '../config'
import type { ClipperUiToaster } from './clipper-ui-toaster'
import { useToaster } from './clipper-ui-toaster'

function getDomPropertyValue(target: HTMLElement, property: string) {
  const computedStyle = window.getComputedStyle(target)
  return computedStyle.getPropertyValue(property)
}

function getBatchDomPropertyValue(target: HTMLElement, properties: string[]) {
  const result: string[] = []
  for (const property of properties)
    result.push(getDomPropertyValue(target, property))
  return result
}

@customElement('dom-inspector')
export class DomInspector extends LitElement {
  @property()
  toggleHotKey: string = 'KeyQ'

  @property()
  levelUpHotKey: string = 'KeyW'

  @property()
  levelDownHotKey: string = 'KeyS'

  @property()
  getNotionKey: any

  @property()
  getClipDatabaseInfo: any

  @state()
  positionCssMap: Record<'container' | 'margin' | 'border' | 'padding', Record<string, string>> = {
    container: {},
    margin: {},
    border: {},
    padding: {},
  }

  @state()
  hoveredElement: HTMLElement | null = null

  hoveredHistoryElement: HTMLElement[] = []

  @state()
  infoClassName = ''

  @state()
  showInspectContainer = false // 是否展示

  @state()
  isClipping: boolean = false // 是否正在剪藏

  @state()
  protected enableInspect = false // 点击开关打开

  @state()
  preUserSelect = ''

  toaster: ClipperUiToaster | undefined = undefined

  // 渲染遮罩层
  renderCover = () => {
    if (!this.hoveredElement) {
      this.showInspectContainer = false
      document.body.style.userSelect = this.preUserSelect
      this.preUserSelect = ''
      return
    }

    this.showInspectContainer = true
    if (!this.preUserSelect)
      this.preUserSelect = getComputedStyle(document.body).userSelect
    document.body.style.userSelect = 'none'

    const target = this.hoveredElement
    const { top, right, bottom, left } = target.getBoundingClientRect()

    const [bt, br, bb, bl] = getBatchDomPropertyValue(target, ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'])
    const [pt, pr, pb, pl] = getBatchDomPropertyValue(target, ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])
    const [mt, mr, mb, ml] = getBatchDomPropertyValue(target, ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'])

    this.positionCssMap = {
      container: {
        '--top': `${top}px`,
        '--left': `${left}px`,
        '--bottom': `${bottom}px`,
        '--right': `${right}px`,
        '--mt': mt,
        '--mr': mr,
        '--mb': mb,
        '--ml': ml,
        '--bt': bt,
        '--br': br,
        '--bb': bb,
        '--bl': bl,
        '--pt': pt,
        '--pr': pr,
        '--pb': pb,
        '--pl': pl,
        'top': `calc(var(--top) - var(--mt))`,
        'left': `calc(var(--left) - var(--ml))`,
        'height': `calc(var(--bottom) - var(--top) + var(--mb) + var(--mt))`,
        'width': `calc(var(--right) - var(--left) + var(--mr) + var(--ml))`,
      },
      margin: {
        'border-width': `var(--mt) var(--mr) var(--mb) var(--ml)`,
      },
      border: {
        'border-width': `var(--bt) var(--br) var(--bb) var(--bl)`,
      },
      padding: {
        'border-width': `var(--pt) var(--pr) var(--pb) var(--pl)`,
      },
    }
    const browserHeight = document.documentElement.clientHeight // 浏览器高度
    // 自动调整信息弹出位置
    const bottomToViewPort = browserHeight - bottom - Number(mb.replace('px', ''))

    const topToViewPort = top - Number(mt.replace('px', ''))

    this.infoClassName
        = topToViewPort > bottomToViewPort
        ? topToViewPort < 100
          ? 'element-info-top-inner'
          : 'element-info-top'
        : bottomToViewPort < 100
          ? 'element-info-bottom-inner'
          : 'element-info-bottom'
  }

  protected willUpdate(changedProperties: PropertyValueMap<this>): void {
    if (changedProperties.has('hoveredElement'))
      this.renderCover()
  }

  removeHoveredElement = () => {
    this.hoveredElement = null
    this.hoveredHistoryElement = []
  }

  // 鼠标移动渲染遮罩层位置
  handleMouseMove = (e: MouseEvent) => {
    if (this.enableInspect) {
      const targetNode = e.target as HTMLElement
      if (targetNode === this.hoveredElement) {
        // TODO: 根据 `hoveredHistoryElement` 判断 targetNode
      }
      else {
        this.hoveredElement = targetNode
        this.hoveredHistoryElement = []
      }
    }
    else {
      this.removeHoveredElement()
    }
  }

  // 鼠标点击唤醒遮罩层
  handleMouseClick = (e: MouseEvent) => {
    if (this.enableInspect && this.showInspectContainer) {
      e.stopPropagation()
      e.preventDefault()
      console.log(this.hoveredElement)
      this.isClipping = true
      const key = Date.now().toString()

      this.toaster?.showToast(key, '✂  Clipping...')
      const blocks = parse2Block(this.hoveredElement as HTMLElement)
      const databaseId = this.getClipDatabaseInfo()?.id
      if (databaseId) {
        uploadToNotion(blocks, this.getNotionKey(), databaseId)
          .then(({ success, url }) => {
            if (success)
              this.toaster?.updateToast(key, '✅ Clip Success', url)
            else
              this.toaster?.updateToast(key, '❌ Clip Failed')
          })
      }

      // 清除遮罩层
      this.hoveredElement = null
      this.enableInspect = false
    }
  }

  // 切换开关
  handleClickSwitch = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()
    this.enableInspect = !this.enableInspect
  }

  handleHotKeyPress = (e: KeyboardEvent) => {
    if (e.code === this.toggleHotKey)
      this.enableInspect = true
  }

  handleHotKeyDown = (e: KeyboardEvent) => {
    if (e.code === this.levelUpHotKey && this.hoveredElement) {
      const parentNode = this.hoveredElement.parentElement

      if (parentNode) {
        this.hoveredHistoryElement.push(this.hoveredElement)
        this.hoveredElement = parentNode
      }
    }

    if (e.code === this.levelDownHotKey && this.hoveredElement) {
      const historyNode = this.hoveredHistoryElement.at(-1)
      if (historyNode) {
        this.hoveredElement = historyNode
        this.hoveredHistoryElement.pop()
      }
      else {
        this.hoveredElement = (this.hoveredElement.children[0] as HTMLElement) ?? this.hoveredElement
      }
    }
  }

  handleHotKeyUp = (e: KeyboardEvent) => {
    if (e.code === this.toggleHotKey)
      this.enableInspect = false
  }

  registerHotKey() {
    document.addEventListener('keypress', this.handleHotKeyPress)
    document.addEventListener('keydown', this.handleHotKeyDown)
    document.addEventListener('keyup', this.handleHotKeyUp)
  }

  unregisterHotKey() {
    document.removeEventListener('keypress', this.handleHotKeyPress)
    document.removeEventListener('keydown', this.handleHotKeyDown)
    document.removeEventListener('keyup', this.handleHotKeyUp)
  }

  registerInspector() {
    window.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('click', this.handleMouseClick, true)
    document.addEventListener('mouseleave', this.removeHoveredElement)
  }

  unregisterInspector() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('click', this.handleMouseClick, true)
    document.removeEventListener('mouseleave', this.removeHoveredElement)
  }

  protected firstUpdated() {
    this.toaster = useToaster()
    this.registerInspector()
    this.registerHotKey()
  }

  disconnectedCallback() {
    this.unregisterInspector()
    this.unregisterHotKey()
  }

  render() {
    return html`
      <div
        class="pointer-events-none transition-all fixed z-[99999] border border-blue-500 rounded-sm ${this.hoveredElement ? 'block' : 'hidden'}"
        style=${styleMap(this.positionCssMap.container)}
      >
        <div class="border-[rgba(255,155,0,0.3)] absolute inset-0" style=${styleMap(this.positionCssMap.margin)}>
          <div class="border-[rgba(255,200,50,0.3)] absolute inset-0" style=${styleMap(this.positionCssMap.border)}>
            <div class="border-[rgba(77,200,0,0.3)] absolute inset-0" style=${styleMap(this.positionCssMap.padding)}>
              <div class="bg-[rgba(120,170,210,0.7)] absolute inset-0"></div>
            </div>
          </div>
        </div>
        <div
          class="absolute ${this.infoClassName} left-1/2 -translate-x-1/2"
        >
          <div class="max-w-full text-sm bg-sky-600 text-white break-all shadow py-1 px-2 rounded">
            Click to Clip ${this.hoveredElement?.className}
          </div>
        </div>
      </div>
      <!-- <div
        id="inspector-switch"
        @click="${this.handleClickSwitch}"
        class="fixed z-[999] p-2 rounded-full shadow-lg border-gray-500 top-10 left-1/2 -translate-x-1/2 cursor-pointer bg-slate-300 border flex"
      >
        Inspect: ${this.enableInspect}
      </div> -->
    `
  }

  static styles = [
    css`
        .element-info-top {
          top: -4px;
          transform: translateY(-100%);
        }
        .element-info-bottom {
          top: calc(100% + 4px);
        }
        .element-info-top-inner {
          top: 4px;
        }
        .element-info-bottom-inner {
          bottom: 4px;
        }
      `,
    unsafeCSS(tailwindInjectedCss),
  ]
}
