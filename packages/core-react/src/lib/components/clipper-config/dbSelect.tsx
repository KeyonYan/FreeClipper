import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'
import { FormControl } from '../ui/form'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
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

interface DbSelectProps {
  value: string
  selects: { label: string, value: string }[]
  onSelect: (value: string) => void
}

export function DbSelect(props: DbSelectProps) {
  const { value, selects, onSelect } = props
  const [open, setOpen] = useState(false)
  const handleSelectClick = (value: string) => {
    onSelect(value)
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
              !value && 'text-muted-foreground',
            )}
          >
            {value
              ? selects.find(
                select => select.value === value,
              )?.label
              : 'Select database'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto h-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search database..." />
          <CommandEmpty>No database found.</CommandEmpty>
          <ScrollArea>
            <CommandGroup>

              {selects.map(select => (
                <CommandItem
                  value={select.label}
                  key={select.value}
                  onSelect={() => handleSelectClick(select.value)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      select.value === value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {select.label}
                </CommandItem>

              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
