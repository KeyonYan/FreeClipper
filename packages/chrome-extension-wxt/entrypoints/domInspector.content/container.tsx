import { Button, DomInspector, Toaster, useToast } from 'free-clipper-core-react'

export function Container() {
  const { toast } = useToast()
  const onToast = () => {
    toast({
      title: 'Hello',
      description: 'This is a toast',
    })
  }
  return (
    <div className="container">
      <DomInspector
        toggleHotKey="q"
        levelUpHotKey="w"
        levelDownHotKey="s"
        onToast={onToast}
      />
      <Toaster />
      <Button>Hello</Button>
    </div>
  )
}
