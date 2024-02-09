import { Checkbox } from '../ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface Mode {
  key: string
  open: boolean
  mode: string
  modeDesc: string
}

interface ModeCheckboxProps {
  key: string
  open: boolean
  mode: string
}

function ModeCheckbox(props: ModeCheckboxProps) {
  const { key, open, mode } = props
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={key} checked={open} />
      <label
        htmlFor={key}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {mode}
      </label>
    </div>
  )
}

const modes = [
  { key: 'free', open: true, mode: 'Free Selection Mode', modeDesc: 'Press the Q key to activate free selection mode, and press the left mouse to clip.' },
  { key: 'copy', open: false, mode: 'Copy Mode', modeDesc: 'Copy mode updates the clipboard.' },
  { key: 'remember', open: false, mode: 'Remember Mode', modeDesc: 'Remember the last clipped element, and clip directly.' },
  { key: 'freepro', open: false, mode: 'Free Selection Pro Mode', modeDesc: 'More advanced features.' },
] as Mode[]

export function ClipperMode() {
  return (
    <div className="flex flex-col gap-4">
      {modes.map(mode => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <ModeCheckbox key={mode.key} open={mode.open} mode={mode.mode} />
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
