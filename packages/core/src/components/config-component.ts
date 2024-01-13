import { LitElement, css, html, unsafeCSS } from 'lit'
import { query, state } from 'lit/decorators.js'
import tailwindInjectedCss from '../tailwind.out.css?raw'
import { searchNotionDatabase } from '../notion-fetch'
import { CLIP_DATABASE_ID, NOTION_KEY } from '../config'
import type { OptionType } from './selector'
import { SelectorComponent } from './selector'
import { CustomInput } from './custom-input'

export class ConfigComponent extends LitElement {
  @state() options: OptionType[] = []
  @state() key = ''
  @state() selectedOption: OptionType | null = null
  @state() databaseId = '63b4ceb167134a799c8d3ff6dd715a99'
  @state() reloadingDatabase = false

  static userStyles = css``

  protected firstUpdated() {
    this.key = localStorage.getItem(NOTION_KEY) ?? ''
    const database = localStorage.getItem(CLIP_DATABASE_ID)
    if (database)
      this.selectedOption = JSON.parse(database)
    this.updateDatabaseOptions()
  }

  async updateDatabaseOptions() {
    const data = await searchNotionDatabase()
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
    localStorage.setItem(NOTION_KEY, this.key)
    localStorage.setItem(CLIP_DATABASE_ID, JSON.stringify(this.selectedOption))
  }

  handleReset() {
    localStorage.removeItem(NOTION_KEY)
    localStorage.removeItem(CLIP_DATABASE_ID)
  }

  onSelect(option: OptionType) {
    this.selectedOption = option
  }

  reloadDatabaseOption() {
    this.reloadingDatabase = true
    localStorage.setItem(NOTION_KEY, this.key)
    this.updateDatabaseOptions()
      .then(() => {
        this.reloadingDatabase = false
      })
  }

  render() {
    return html`
      <div class='fixed top-5 right-5 w-[300px] h-auto rounded-lg shadow-md bg-white flex flex-col gap-2 px-2 py-4'>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold'>Key</div>
          <custom-input .value=${this.key} .onChangeValue=${(v: string) => this.key = v} .placeholder=${'Notion Intergration Key'}></custom-input>
        </div>
        <div class='flex flex-col gap-2 justify-center w-full'>
          <div class='text-sm font-bold flex flex-row items-center gap-2'>
            Database
            <svg @click=${this.reloadDatabaseOption} class="${this.reloadingDatabase ? 'animate-spin' : ''} cursor-pointer" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.84998 7.49998C1.84998 4.66458 4.05979 1.84998 7.49998 1.84998C10.2783 1.84998 11.6515 3.9064 12.2367 5H10.5C10.2239 5 10 5.22386 10 5.5C10 5.77614 10.2239 6 10.5 6H13.5C13.7761 6 14 5.77614 14 5.5V2.5C14 2.22386 13.7761 2 13.5 2C13.2239 2 13 2.22386 13 2.5V4.31318C12.2955 3.07126 10.6659 0.849976 7.49998 0.849976C3.43716 0.849976 0.849976 4.18537 0.849976 7.49998C0.849976 10.8146 3.43716 14.15 7.49998 14.15C9.44382 14.15 11.0622 13.3808 12.2145 12.2084C12.8315 11.5806 13.3133 10.839 13.6418 10.0407C13.7469 9.78536 13.6251 9.49315 13.3698 9.38806C13.1144 9.28296 12.8222 9.40478 12.7171 9.66014C12.4363 10.3425 12.0251 10.9745 11.5013 11.5074C10.5295 12.4963 9.16504 13.15 7.49998 13.15C4.05979 13.15 1.84998 10.3354 1.84998 7.49998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
          </div>
          <selector-component .placeholder=${'Select an database'} .selectedOption=${this.selectedOption} .onSelect=${(o: OptionType) => this.onSelect(o)} .options=${this.options}></selector-component>
        </div>
        <div class='flex flex-row gap-2 items-center justify-center px-2 py-1'>
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleSave}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32"><path fill="currentColor" d="m27.71 9.29l-5-5A1 1 0 0 0 22 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a1 1 0 0 0-.29-.71M12 6h8v4h-8Zm8 20h-8v-8h8Zm2 0v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8H6V6h4v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6.41l4 4V26Z"/></svg>
            Save
          </button> 
          <button class='rounded-md shadow-sm border w-auto px-2 py-1 inline-flex items-center gap-1' @click=${this.handleReset}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.85355 2.14645C5.04882 2.34171 5.04882 2.65829 4.85355 2.85355L3.70711 4H9C11.4853 4 13.5 6.01472 13.5 8.5C13.5 10.9853 11.4853 13 9 13H5C4.72386 13 4.5 12.7761 4.5 12.5C4.5 12.2239 4.72386 12 5 12H9C10.933 12 12.5 10.433 12.5 8.5C12.5 6.567 10.933 5 9 5H3.70711L4.85355 6.14645C5.04882 6.34171 5.04882 6.65829 4.85355 6.85355C4.65829 7.04882 4.34171 7.04882 4.14645 6.85355L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645L4.14645 2.14645C4.34171 1.95118 4.65829 1.95118 4.85355 2.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
            Reset
          </button> 
        </div>
      </div>
    `
  }

  static styles = [this.userStyles, unsafeCSS(tailwindInjectedCss)]
}

customElements.define('selector-component', SelectorComponent)
customElements.define('custom-input', CustomInput)
