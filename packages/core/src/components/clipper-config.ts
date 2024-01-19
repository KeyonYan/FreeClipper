import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'
import { searchNotionDatabase } from '../notion-fetch'
import type { DatabaseInfo } from '../config'
import SaveIcon from '../assets/save.svg'
import ResetIcon from '../assets/reset.svg'
import ReflushIcon from '../assets/reflush.svg'
import type { ClipperUiToaster } from './clipper-ui-toaster'
import { useToaster } from './clipper-ui-toaster'

@customElement('clipper-config')
export class ClipperConfig extends LitElement {
  @property({ type: Function }) setNotionKey: (...args: any) => any = () => {}
  @property({ type: Function }) getNotionKey: (...args: any) => any = () => {}
  @property({ type: Function }) getClipDatabaseInfo: (...args: any) => any = () => {}
  @property({ type: Function }) setClipDatabaseInfo: (...args: any) => any = () => {}
  @property({ type: Function }) handleReset: (...args: any) => any = () => {}
  @state() options: DatabaseInfo[] = []
  @state() key = ''
  @state() selectedOption: DatabaseInfo | null = null
  @state() reloadingDatabase = false

  toaster: ClipperUiToaster | undefined = undefined

  protected firstUpdated() {
    this.toaster = useToaster()
    this.key = this.getNotionKey() ?? ''
    console.log('firstUpdated: ', this.key)

    const database = this.getClipDatabaseInfo()
    if (database)
      this.selectedOption = database
    if (this.key !== '')
      this.updateDatabaseOptions()
  }

  async updateDatabaseOptions() {
    try {
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
    catch (e: any) {
      console.log(e)
      this.reloadingDatabase = false
      const key = Date.now().toString()
      this.toaster?.showToast(key, `❌ ${e.message ?? 'Unknown Error'}`, 3000)
    }
  }

  handleSave() {
    this.setNotionKey(this.key)
    if (this.selectedOption)
      this.setClipDatabaseInfo(this.selectedOption)
    const key = Date.now().toString()
    this.toaster?.showToast(key, '✅ Save Success', 3000)
  }

  handleResetClick() {
    this.handleReset()
    this.key = ''
    this.selectedOption = null
    const key = Date.now().toString()
    this.toaster?.showToast(key, '✅ Reset Success', 3000)
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
        const key = Date.now().toString()
        this.toaster?.showToast(key, '✅ Reload Success', 3000)
        this.reloadingDatabase = false
      })
  }

  render() {
    return html`
      <div class='w-[300px] bg-white flex flex-col gap-2 px-2 py-4'>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold'>Key</div>
          <clipper-ui-input .value=${this.key} .onChangeValue=${(v: string) => this.key = v} .placeholder=${'Notion Intergration Key'}></clipper-ui-input>
        </div>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold flex flex-row items-center gap-2'>
            Database
            <div @click=${this.reloadDatabaseOption} class='cursor-pointer hover:bg-[#F4F4F5] flex justify-center items-center p-2 rounded-md'>
              <img src=${ReflushIcon} class="${this.reloadingDatabase ? 'animate-spin' : ''}" />
            </div>
          </div>
          <clipper-ui-selector .placeholder=${'Select an database'} .selectedOption=${this.selectedOption} .onSelect=${(o: DatabaseInfo) => this.handleSelect(o)} .options=${this.options}></clipper-ui-selector>
        </div>
        <div class='flex flex-row gap-2 items-center justify-center px-2 py-1'>
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1 hover:bg-[#F4F4F5]' @click=${this.handleSave}>
            <img src=${SaveIcon} />
            Save
          </button> 
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1 hover:bg-[#F4F4F5]' @click=${this.handleResetClick}>
            <img src=${ResetIcon} />
            Reset
          </button> 
        </div>
      </div>
    `
  }

  static styles = [unsafeCSS(tailwindInjectedCss)]
}
