import { useState } from 'react'
import { ClipperConfig } from 'free-clipper-core-react'
import { getClipDatabaseInfo, getNotionKey, setClipDatabaseInfo, setNotionKey } from '@/lib/store'

function App() {
  return (
    <div className="w-[260px] h-auto flex flex-col p-4 justify-center items-start">
      <div className="text-2xl font-bold">Config</div>
      <ClipperConfig
        getNotionKey={getNotionKey}
        getClipDatabaseInfo={getClipDatabaseInfo}
        setNotionKey={setNotionKey}
        setClipDatabaseInfo={setClipDatabaseInfo}
      />
    </div>
  )
}

export default App
