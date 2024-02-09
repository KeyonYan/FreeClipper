import { useState } from 'react'
import { ClipperConfig, ClipperMode, ClipperTabs } from 'free-clipper-core-react'
import { getClipDatabaseInfo, getNotionKey, setClipDatabaseInfo, setNotionKey } from '@/lib/store'

function App() {
  const tabs = [
    {
      value: 'config',
      label: 'Config',
      content: (
        <ClipperConfig
          getNotionKey={getNotionKey}
          getClipDatabaseInfo={getClipDatabaseInfo}
          setNotionKey={setNotionKey}
          setClipDatabaseInfo={setClipDatabaseInfo}
        />
      ),
    },
    {
      value: 'mode',
      label: 'Mode',
      content: (
        <ClipperMode />
      ),
    },
  ]
  return (
    <div className="w-[260px] h-auto flex flex-col p-2 justify-start items-start">
      <ClipperTabs tabs={tabs} />
    </div>
  )
}

export default App
