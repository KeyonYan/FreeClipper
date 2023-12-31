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

export class DomInspectElement extends LitElement {
  @property()
  toggleHotKey: string = 'KeyI'

  @property()
  levelUpHotKey: string = 'KeyW'

  @property()
  levelDownHotKey: string = 'KeyS'

  @property()
  showSwitch: boolean = true

  @property()
  autoToggle: boolean = false

  @state()
  position = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    border: { top: 0, right: 0, bottom: 0, left: 0 },
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  } // 弹窗位置

  @state()
  elementMeta: { text: string, e: HTMLElement | null } = { text: '', e: null } // 选中节点信息

  @state()
  infoClassName = { vertical: '', horizon: '' } // 信息浮块位置类名

  @state()
  infoWidth = '300px'

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

  // 20px -> 20
  getDomPropertyValue = (target: HTMLElement, property: string) => {
    const computedStyle = window.getComputedStyle(target)
    return Number(computedStyle.getPropertyValue(property).replace('px', ''))
  }

  // 渲染遮罩层
  renderCover = () => {
    if (!this.elementMeta.e)
      return

    const target = this.elementMeta.e
    const { top, right, bottom, left } = target.getBoundingClientRect()
    this.position = {
      top,
      right,
      bottom,
      left,
      border: {
        top: this.getDomPropertyValue(target, 'border-top-width'),
        right: this.getDomPropertyValue(target, 'border-right-width'),
        bottom: this.getDomPropertyValue(target, 'border-bottom-width'),
        left: this.getDomPropertyValue(target, 'border-left-width'),
      },
      padding: {
        top: this.getDomPropertyValue(target, 'padding-top'),
        right: this.getDomPropertyValue(target, 'padding-right'),
        bottom: this.getDomPropertyValue(target, 'padding-bottom'),
        left: this.getDomPropertyValue(target, 'padding-left'),
      },
      margin: {
        top: this.getDomPropertyValue(target, 'margin-top'),
        right: this.getDomPropertyValue(target, 'margin-right'),
        bottom: this.getDomPropertyValue(target, 'margin-bottom'),
        left: this.getDomPropertyValue(target, 'margin-left'),
      },
    }
    const browserHeight = document.documentElement.clientHeight // 浏览器高度
    const browserWidth = document.documentElement.clientWidth // 浏览器宽度
    // 自动调整信息弹出位置
    const bottomToViewPort = browserHeight - bottom - this.getDomPropertyValue(target, 'margin-bottom') // 距浏览器视口底部距离
    const rightToViewPort = browserWidth - right - this.getDomPropertyValue(target, 'margin-right') // 距浏览器右边距离
    const topToViewPort = top - this.getDomPropertyValue(target, 'margin-top')
    const leftToViewPort = left - this.getDomPropertyValue(target, 'margin-left')
    this.infoClassName = {
      vertical:
        topToViewPort > bottomToViewPort
          ? topToViewPort < 100
            ? 'element-info-top-inner'
            : 'element-info-top'
          : bottomToViewPort < 100
            ? 'element-info-bottom-inner'
            : 'element-info-bottom',
      horizon:
        leftToViewPort >= rightToViewPort
          ? 'element-info-right'
          : 'element-info-left',
    }
    this.infoWidth = `${Math.max(right - left + this.getDomPropertyValue(target, 'margin-right') + this.getDomPropertyValue(target, 'margin-left'), 300)}px`
    // 防止 select
    if (!this.preUserSelect)
      this.preUserSelect = getComputedStyle(document.body).userSelect

    document.body.style.userSelect = 'none'
    // 获取元素信息
    this.showInspectContainer = true
  }

  removeCover = () => {
    this.showInspectContainer = false
    document.body.style.userSelect = this.preUserSelect
    this.preUserSelect = ''
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
      if (targetNode) {
        this.elementMeta.text = targetNode.textContent ?? ''
        this.elementMeta.e = targetNode
        this.renderCover()
      }
    }
    else {
      this.removeCover()
    }
  }

  // 鼠标点击唤醒遮罩层
  handleMouseClick = (e: MouseEvent) => {
    if (this.enableInspect) {
      if (this.showInspectContainer) {
        // 阻止冒泡
        e.stopPropagation()
        // 阻止默认事件
        e.preventDefault()
        // 剪藏

        // 清除遮罩层
        this.removeCover()
        if (this.autoToggle)
          this.enableInspect = false
      }
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
    if (e.code === this.levelDownHotKey) {
      console.log(this.elementMeta.e?.parentElement)
      this.elementMeta.e = this.elementMeta.e?.parentElement ?? this.elementMeta.e
    }
    if (e.code === this.levelUpHotKey) {
      console.log(this.elementMeta.e?.children)
      this.elementMeta.e = (this.elementMeta.e?.children[0] as HTMLElement) ?? this.elementMeta.e
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

  protected firstUpdated() {
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mousemove', this.handleSwitchMove)
    document.addEventListener('click', this.handleMouseClick, true)
    document.addEventListener('mouseleave', this.removeCover)
    document.addEventListener('mouseup', this.handleMouseUp)

    this.registerHotKey()
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mousemove', this.handleSwitchMove)
    document.removeEventListener('click', this.handleMouseClick, true)
    document.removeEventListener('mouseleave', this.removeCover)
    document.removeEventListener('mouseup', this.handleMouseUp)

    this.unregisterHotKey()
  }

  render() {
    const containerPosition = {
      display: this.elementMeta.e ? 'block' : 'none',
      top: `${this.position.top - this.position.margin.top}px`,
      left: `${this.position.left - this.position.margin.left}px`,
      height: `${this.position.bottom - this.position.top + this.position.margin.bottom + this.position.margin.top}px`,
      width: `${this.position.right - this.position.left + this.position.margin.right + this.position.margin.left}px`,
    }
    const marginPosition = {
      borderTopWidth: `${this.position.margin.top}px`,
      borderRightWidth: `${this.position.margin.right}px`,
      borderBottomWidth: `${this.position.margin.bottom}px`,
      borderLeftWidth: `${this.position.margin.left}px`,
    }
    const borderPosition = {
      borderTopWidth: `${this.position.border.top}px`,
      borderRightWidth: `${this.position.border.right}px`,
      borderBottomWidth: `${this.position.border.bottom}px`,
      borderLeftWidth: `${this.position.border.left}px`,
    }
    const paddingPosition = {
      borderTopWidth: `${this.position.padding.top}px`,
      borderRightWidth: `${this.position.padding.right}px`,
      borderBottomWidth: `${this.position.padding.bottom}px`,
      borderLeftWidth: `${this.position.padding.left}px`,
    }
    return html`
      <div
        class="dom-inspector-container"
        id="dom-inspector-container"
        style=${styleMap(containerPosition)}
      >
        <div class="margin-overlay" style=${styleMap(marginPosition)}>
          <div class="border-overlay" style=${styleMap(borderPosition)}>
            <div class="padding-overlay" style=${styleMap(paddingPosition)}>
              <div class="content-overlay"></div>
            </div>
          </div>
        </div>
        <div
          id="element-info"
          class="element-info ${this.infoClassName.vertical} ${this.infoClassName.horizon}"
          style=${styleMap({ width: this.infoWidth })}
        >
          <div class="element-info-content">
            <div class="name-line">
              <div class="element-name">
                <span class="element-tip">Click to Clip</span>
                <span class="element-title">&lt;${this.elementMeta.text}&gt;</span>
              </div>
            </div>
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
  .dom-inspector-container {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    .margin-overlay {
      position: absolute;
      inset: 0;
      border-style: solid;
      border-color: rgba(255, 155, 0, 0.3);
      .border-overlay {
        position: absolute;
        inset: 0;
        border-style: solid;
        border-color: rgba(255, 200, 50, 0.3);
        .padding-overlay {
          position: absolute;
          inset: 0;
          border-style: solid;
          border-color: rgba(77, 200, 0, 0.3);
          .content-overlay {
            position: absolute;
            inset: 0;
            background: rgba(120, 170, 210, 0.7);
          }
        }
      }
    }
  }
  .element-info {
    position: absolute;
  }
  .element-info-content {
    max-width: 100%;
    font-size: 12px;
    color: #000;
    background-color: #fff;
    word-break: break-all;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    padding: 4px 8px;
    border-radius: 4px;
  }
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
  .element-info-left {
    left: 0;
    display: flex;
    justify-content: flex-start;
  }
  .element-info-right {
    right: 0;
    display: flex;
    justify-content: flex-end;
  }
  .element-name .element-title {
    color: coral;
    font-weight: bold;
  }
  .element-name .element-tip {
    color: #006aff;
  }


`

  static styles = [this.userStyles, unsafeCSS(tailwindInjectedCss)]
}
