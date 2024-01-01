import type { PropertyValueMap } from 'lit'
import { LitElement, css, html, unsafeCSS } from 'lit'
import { property, query, state } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import tailwindInjectedCss from './tailwind.out.css?raw'

// 兼容 chrome 最新版，获取 e.path
export function composedPath(e: any) {
  // 存在则直接return
  if (e.path)
    return e.path

  // 不存在则遍历target节点
  let target = e.target
  e.path = []
  while (target.parentNode !== null) {
    e.path.push(target)
    target = target.parentNode
  }
  // 最后补上document和window
  e.path.push(document, window)
  return e.path
}

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

export class DomInspectElement extends LitElement {
  @property()
  toggleHotKey: string = 'KeyQ'

  @property()
  levelUpHotKey: string = 'KeyW'

  @property()
  levelDownHotKey: string = 'KeyS'

  @property()
  showSwitch: boolean = true

  @state()
  position: Record<'container' | 'margin' | 'border' | 'padding', Record<string, string>> = {
    container: {},
    margin: {},
    border: {},
    padding: {},
  } // 弹窗位置

  @state()
  hoveredElement: HTMLElement | null = null

  @state()
  infoClassName = { vertical: '', horizon: '' } // 信息浮块位置类名

  @state()
  showInspectContainer = false // 是否展示

  @state()
  dragging = false // 是否正在拖拽中

  @state()
  mousePosition = { baseX: 0, baseY: 0, moveX: 0, moveY: 0 }

  @state()
  protected enableInspect = false // 点击开关打开

  @state()
  moved = false

  @state()
  hoverSwitch = false

  @state()
  preUserSelect = ''

  @query('#inspector-switch')
  inspectorSwitchRef!: HTMLDivElement

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

    this.position = {
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

    this.infoClassName = {
      vertical:
        topToViewPort > bottomToViewPort
          ? topToViewPort < 100
            ? 'element-info-top-inner'
            : 'element-info-top'
          : bottomToViewPort < 100
            ? 'element-info-bottom-inner'
            : 'element-info-bottom',
      horizon: '',
    }
  }

  protected willUpdate(changedProperties: PropertyValueMap<this>): void {
    if (changedProperties.has('hoveredElement'))
      this.renderCover()
  }

  removeCover = () => {
    this.hoveredElement = null
  }

  // 移动按钮
  handleSwitchMove = (e: MouseEvent) => {
    if (composedPath(e).includes(this))
      this.hoverSwitch = true
    else
      this.hoverSwitch = false

    // 判断是否在拖拽按钮
    if (this.dragging) {
      this.moved = true
      this.inspectorSwitchRef.style.left = `${this.mousePosition.baseX + (e.pageX - this.mousePosition.moveX)}px`
      this.inspectorSwitchRef.style.top = `${this.mousePosition.baseY + (e.pageY - this.mousePosition.moveY)}px`
    }
  }

  // 鼠标移动渲染遮罩层位置
  handleMouseMove = (e: MouseEvent) => {
    if (!this.dragging && this.enableInspect && !this.hoverSwitch) {
      const targetNode = e.target as HTMLElement
      if (targetNode)
        this.hoveredElement = targetNode
    }
    else {
      this.removeCover()
    }
  }

  // 鼠标点击唤醒遮罩层
  handleMouseClick = (e: MouseEvent) => {
    if (this.enableInspect && this.showInspectContainer) {
      // 阻止冒泡
      e.stopPropagation()
      // 阻止默认事件
      e.preventDefault()
      // 剪藏

      // 清除遮罩层
      this.hoveredElement = null
      this.enableInspect = false
    }
  }

  // 记录鼠标按下时初始位置
  handleRecordSwitchPosition = (e: MouseEvent) => {
    this.mousePosition = {
      baseX: this.inspectorSwitchRef.offsetLeft,
      baseY: this.inspectorSwitchRef.offsetTop,
      moveX: e.pageX,
      moveY: e.pageY,
    }
    this.dragging = true
    e.preventDefault()
  }

  // 结束拖拽
  handleMouseUp = () => {
    this.dragging = false
  }

  // 切换开关
  handleClickSwitch = (e: Event) => {
    if (!this.moved) {
      this.enableInspect = !this.enableInspect
      e.preventDefault()
      e.stopPropagation()
    }
    this.moved = false
  }

  handleHotKeyPress = (e: KeyboardEvent) => {
    if (e.code === this.toggleHotKey)
      this.enableInspect = true
  }

  handleHotKeyDown = (e: KeyboardEvent) => {
    if (e.code === this.levelDownHotKey)
      this.hoveredElement = this.hoveredElement?.parentElement ?? this.hoveredElement

    if (e.code === this.levelUpHotKey)
      this.hoveredElement = (this.hoveredElement?.children[0] as HTMLElement) ?? this.hoveredElement
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
    document.addEventListener('mouseleave', this.removeCover)
  }

  unregisterInspector() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('click', this.handleMouseClick, true)
    document.removeEventListener('mouseleave', this.removeCover)
  }

  protected firstUpdated() {
    window.addEventListener('mousemove', this.handleSwitchMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    this.registerInspector()
    this.registerHotKey()
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.handleSwitchMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.unregisterInspector()
    this.unregisterHotKey()
  }

  render() {
    return html`
      <div
        class="pointer-events-none transition-all fixed z-[99999] border border-blue-500 rounded-sm ${this.hoveredElement ? 'block' : 'hidden'}"
        style=${styleMap(this.position.container)}
      >
        <div class="border-[rgba(255,155,0,0.3)] absolute inset-0" style=${styleMap(this.position.margin)}>
          <div class="border-[rgba(255,200,50,0.3)] absolute inset-0" style=${styleMap(this.position.border)}>
            <div class="border-[rgba(77,200,0,0.3)] absolute inset-0" style=${styleMap(this.position.padding)}>
              <div class="bg-[rgba(120,170,210,0.7)] absolute inset-0"></div>
            </div>
          </div>
        </div>
        <div
          class="absolute ${this.infoClassName.vertical} left-1/2 -translate-x-1/2"
        >
          <div class="max-w-full text-sm bg-sky-600 text-white break-all shadow py-1 px-2 rounded">
            Click to Clip ${this.hoveredElement?.className}
          </div>
        </div>
      </div>
      <div
        id="inspector-switch"
        @click="${this.handleClickSwitch}"
        @mousedown="${this.handleRecordSwitchPosition}"
        class="fixed z-[999] p-2 rounded-full shadow-lg border-gray-500 top-10 left-1/2 -translate-x-1/2 cursor-pointer ${this.enableInspect ? 'text-blue-700' : ''} bg-slate-300 border ${this.showSwitch ? 'flex' : 'hidden'}"
      >
       OP: ${this.enableInspect}
      </div>
    `
  }

  static userStyles = css`
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
`

  static styles = [this.userStyles, unsafeCSS(tailwindInjectedCss)]
}
