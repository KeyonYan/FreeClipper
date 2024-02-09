import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

export interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

export interface ClipperTabsProps {
  tabs: Tab[]
}

export function ClipperTabs(props: ClipperTabsProps) {
  const { tabs } = props
  return (
    <Tabs defaultValue="config" className="w-auto">
      <TabsList>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent className="mt-4" key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
