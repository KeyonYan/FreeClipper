import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'
import { searchNotionDatabase } from '../notion-fetch'
import type { DatabaseInfo } from '../config'
import SaveIcon from '../assets/save.svg'
import ResetIcon from '../assets/reset.svg'
import ReflushIcon from '../assets/reflush.svg'

@customElement('clipper-config')
export class ClipperConfig extends LitElement {
  @property({ type: Function }) setNotionKey: (...args: any) => any = () => {}
  @property({ type: Function }) getNotionKey: any
  @property({ type: Function }) getClipDatabaseInfo: any
  @property({ type: Function }) setClipDatabaseInfo: any
  @property({ type: Function }) handleReset: any
  @state() options: DatabaseInfo[] = []
  @state() key = ''
  @state() selectedOption: DatabaseInfo | null = null
  @state() reloadingDatabase = false

  protected firstUpdated() {
    this.key = this.getNotionKey() ?? ''
    const database = this.getClipDatabaseInfo()
    if (database)
      this.selectedOption = database
    this.updateDatabaseOptions()
  }

  async updateDatabaseOptions() {
    const data = await searchNotionDatabase(this.key)
    const databases = data.results as any[]
    this.options = databases.map((db) => {
      return {
        id: db.id as string,
        name: db.title.map((text: any) => text.text.content).join() as string,
        icon: db.icon,
      }
    })
  }

  handleSave() {
    this.setNotionKey(this.key)
    if (this.selectedOption)
      this.setClipDatabaseInfo(this.selectedOption)
  }

  handleSelect(option: DatabaseInfo) {
    this.selectedOption = option
    this.handleSave()
  }

  reloadDatabaseOption() {
    this.reloadingDatabase = true
    this.setNotionKey(this.key)
    this.updateDatabaseOptions()
      .then(() => {
        this.reloadingDatabase = false
      })
  }

  render() {
    return html`
      <div class='w-[300px] rounded-lg shadow-md bg-white flex flex-col gap-2 px-2 py-4'>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold'>Key</div>
          <clipper-ui-input .value=${this.key} .onChangeValue=${(v: string) => this.key = v} .placeholder=${'Notion Intergration Key'}></clipper-ui-input>
        </div>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold flex flex-row items-center gap-2'>
            Database
            <img src=${ReflushIcon} @click=${this.reloadDatabaseOption} class="${this.reloadingDatabase ? 'animate-spin' : ''} cursor-pointer" />
          </div>
          <clipper-ui-selector .placeholder=${'Select an database'} .selectedOption=${this.selectedOption} .onSelect=${(o: DatabaseInfo) => this.handleSelect(o)} .options=${this.options}></clipper-ui-selector>
        </div>
        <div class='flex flex-row gap-2 items-center justify-center px-2 py-1'>
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleSave}>
            <img src=${SaveIcon} />
            Save
          </button> 
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleReset}>
            <img src=${ResetIcon} />
            Reset
          </button> 
        </div>
      </div>
    `
  }

  static styles = [unsafeCSS(tailwindInjectedCss)]
}
