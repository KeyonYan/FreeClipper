import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { FormControl } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import type { DatabaseInfo } from '../clipper-config'
import { SelectedOption } from './selectedOption'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

interface DbSelectProps {
  selectedId: string
  options: DatabaseInfo[]
  onSelect: (id: string) => void
}

export function DbSelect(props: DbSelectProps) {
  const { selectedId, options, onSelect } = props
  const [open, setOpen] = useState(false)
  const handleSelectClick = (id: string) => {
    onSelect(id)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between',
              !selectedId && 'text-muted-foreground',
            )}
          >
            <SelectedOption selectedId={selectedId} options={options} />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto h-[160px] p-0">
        <Command>
          <CommandInput placeholder="Search database..." />
          <CommandEmpty>No database found.</CommandEmpty>
          <ScrollArea>
            <CommandGroup>
              {options && options.map(option => (
                <CommandItem
                  className="flex flex-row justify-between"
                  value={option.name}
                  key={option.id}
                  onSelect={() => handleSelectClick(option.id)}
                >
                  <div className="flex flex-row gap-2 items-start">
                    <div>{option.icon.emoji}</div>
                    <div>{option.name}</div>
                  </div>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      option.id === selectedId
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
