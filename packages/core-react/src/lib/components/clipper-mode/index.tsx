import { useEffect, useState } from 'react'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { Checkbox } from '../ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface Mode {
  key: string
  open: boolean
  mode: string
  modeDesc?: string
}

interface ModeCheckboxProps {
  modeKey: string
  open: boolean
  mode: string
  onCheckedChange: (checked: CheckedState, modeKey: string) => void
}

function ModeCheckbox(props: ModeCheckboxProps) {
  const { modeKey, open, mode, onCheckedChange } = props
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={modeKey} checked={open} onCheckedChange={checked => onCheckedChange(checked, modeKey)} />
      <label
        htmlFor={modeKey}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {mode}
      </label>
    </div>
  )
}

interface ClipperModeProps {
  getModeConfig: () => { [key: string]: boolean }
  setModeConfig: (modeConfig: { [key: string]: boolean }) => void
}

export function ClipperMode(props: ClipperModeProps) {
  const { getModeConfig, setModeConfig } = props
  const [modes, setModes] = useState<Mode[]>([
    { key: 'free', open: true, mode: 'Free Selection Mode', modeDesc: 'Press the Q key to activate free selection mode, and press the left mouse to clip.' },
    { key: 'copy', open: false, mode: 'Copy Mode', modeDesc: 'Copy mode updates the clipboard.' },
    { key: 'remember', open: false, mode: 'Remember Mode', modeDesc: 'Remember the last clipped element, and clip directly.' },
    { key: 'freepro', open: false, mode: 'Free Selection Pro Mode', modeDesc: 'More advanced features.' },
  ])

  const initModeConfig = async () => {
    const modeConfig = await getModeConfig()
    if (modeConfig === null)
      return
    console.log('modeConfig', modeConfig)
    const newModes = modes.map((mode) => {
      if (modeConfig[mode.key] === undefined)
        mode.open = false
      else
        mode.open = modeConfig[mode.key]
      return mode
    })
    console.log('newModes', newModes)
    setModes(newModes)
  }

  useEffect(() => {
    initModeConfig()
  }, [])
  const onCheckedChange = (checked: CheckedState, key: string) => {
    const newModes = modes.map((mode) => {
      if (mode.key === key)
        mode.open = checked === true
      return mode
    })
    setModes(newModes)
    const modeConfig = newModes.reduce((acc, mode) => {
      acc[mode.key] = mode.open
      return acc
    }, {} as { [key: string]: boolean })
    console.log('newModeConfig', modeConfig)
    setModeConfig(modeConfig)
  }
  return (
    <div className="flex flex-col gap-4">
      {modes.map(mode => (
        <TooltipProvider key={mode.key}>
          <Tooltip>
            <TooltipTrigger>
              <ModeCheckbox
                modeKey={mode.key}
                open={mode.open}
                mode={mode.mode}
                onCheckedChange={onCheckedChange}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{mode.modeDesc}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
}
