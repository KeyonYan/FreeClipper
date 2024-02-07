'use client'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Input } from '../ui/input'
import { Toaster } from '../ui/toaster'
import { DbSelect } from './dbSelect'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

const databases = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
]

const FormSchema = z.object({
  notionKey: z.string({ required_error: 'Please enter a Notion key.' })
    .min(32, { message: 'Notion key must be 32 characters long.' })
    .max(32, { message: 'Notion key must be 32 characters long.' }),
  database: z.string({ required_error: 'Please select a database.' })
    .min(1),
})

export interface ClipperConfigProps {
  getNotionKey: () => Promise<string | null>
  getClipDatabaseInfo: () => Promise<string | null>
  setNotionKey: (key: string) => Promise<void>
  setClipDatabaseInfo: (info: string) => Promise<void>
}

export function ClipperConfig(props: ClipperConfigProps) {
  const { getNotionKey, getClipDatabaseInfo, setNotionKey, setClipDatabaseInfo } = props
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  useEffect(() => {
    getNotionKey().then((key) => {
      if (key)
        form.setValue('notionKey', key)
    })
    getClipDatabaseInfo().then((info) => {
      if (info)
        form.setValue('database', info)
    })
  }, [])

  async function onSave(data: z.infer<typeof FormSchema>) {
    await setNotionKey(data.notionKey)
    await setClipDatabaseInfo(data.database)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="notionKey"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>NotionKey</FormLabel>
              <Input placeholder="notion key" {...field} />
              <FormDescription>
                This is the Key of Notion Intergration, get from
                {' '}
                <a className="underline" target="_blank" href="https://www.notion.so/my-integrations">here</a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="database"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Database</FormLabel>
              <DbSelect value={field.value} selects={databases} onSelect={(v: string) => form.setValue('database', v)} />
              <FormDescription>
                This is the database you want to clip to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
