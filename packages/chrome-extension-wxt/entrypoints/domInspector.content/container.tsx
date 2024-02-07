import { DomInspector } from 'free-clipper-core-react'
import { getNotionKey } from '@/utils/store.ts'

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
