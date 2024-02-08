import { DomInspector } from 'free-clipper-core-react'
import { getClipDatabaseInfo, getNotionKey } from '@/lib/store.ts'

export function Container() {
  const clip = async (blocks: any, notionKey: string, clipDatabaseId: string, title: string) => {
    console.log('start clip')
    const message = JSON.stringify({ blocks, notionKey, clipDatabaseId, title })
    const resp = await browser.runtime.sendMessage(message)
    console.log('resp', resp)
    return resp
  }
  return (
    <div className="container">
      <DomInspector
        toggleHotKey="q"
        levelUpHotKey="w"
        levelDownHotKey="s"
        getNotionKey={getNotionKey}
        getClipDatabaseInfo={getClipDatabaseInfo}
        onClip={clip}
      />
    </div>
  )
}
