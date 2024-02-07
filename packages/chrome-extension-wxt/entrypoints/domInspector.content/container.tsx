import { DomInspector } from 'free-clipper-core-react'
import { getClipDatabaseInfo, getNotionKey } from '@/lib/store.ts'

export function Container() {
  return (
    <div className="container">
      <DomInspector
        toggleHotKey="q"
        levelUpHotKey="w"
        levelDownHotKey="s"
        getNotionKey={getNotionKey}
        getClipDatabaseInfo={getClipDatabaseInfo}
      />
    </div>
  )
}
