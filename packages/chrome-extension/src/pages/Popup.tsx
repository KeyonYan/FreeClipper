import { useEffect } from 'react'

export default function () {
  useEffect(() => {
    console.log('Hello from the popup!')
  }, [])

  return (
    <div className="h-full flex flex-col items-center">
      <div className="text-lg font-bold">FreeClipper</div>
    </div>
  )
}
