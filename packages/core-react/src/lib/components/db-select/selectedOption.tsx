import type { DatabaseInfo } from '../clipper-config'

interface SelectedOptionProps {
  selectedId: string
  options: DatabaseInfo[]
}
export function SelectedOption(props: SelectedOptionProps) {
  const { selectedId, options } = props
  if (!selectedId)
    return <div>Select database</div>
  const selectOption = options.find(option => option.id === selectedId)
  return (
    <div className="flex flex-row gap-2 items-start">
      <div>{selectOption?.icon.emoji}</div>
      <div>{selectOption?.name}</div>
    </div>
  )
}
