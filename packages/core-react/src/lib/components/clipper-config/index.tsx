'use client'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { UpdateIcon } from '@radix-ui/react-icons'
import { Input } from '../ui/input'
import { Toaster } from '../ui/toaster'
import { DbSelect } from '../db-select/dbSelect'
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
import { searchNotionDatabase } from '@/api/notion-fetch'
import { TubeLoadingIcon } from '@/icons/TubeLoadingIcon'

const FormSchema = z.object({
  notionKey: z.string({ required_error: 'Please enter a Notion key.' }),
  // .length(32, { message: 'Notion key must be 32 characters long.' }),
  database: z.object({
    id: z.string().default(''),
    name: z.string().default(''),
    icon: z.object({
      type: z.string().default(''),
      emoji: z.string().default(''),
    }),
  }),
})

export type DatabaseInfo = z.infer<typeof FormSchema.shape.database>

export interface ClipperConfigProps {
  getNotionKey: () => Promise<string | null>
  getClipDatabaseInfo: () => Promise<DatabaseInfo | null>
  setNotionKey: (key: string) => Promise<void>
  setClipDatabaseInfo: (info: DatabaseInfo) => Promise<void>
}

export function ClipperConfig(props: ClipperConfigProps) {
  const { getNotionKey, getClipDatabaseInfo, setNotionKey, setClipDatabaseInfo } = props
  const [databases, setDatabases] = React.useState<DatabaseInfo[]>([])
  const [reloadingDatabase, setReloadingDatabase] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const updateDatabaseOptions = async (key: string, title?: string) => {
    try {
      const data = await searchNotionDatabase(key, title)
      const newDatabases = data.results.map((db: any) => {
        return {
          id: db.id as string,
          name: db.title.map((text: any) => text.text.content).join() as string,
          icon: db.icon,
        }
      })
      console.log('newDatabases', newDatabases)
      setDatabases(newDatabases)
    }
    catch (e: any) {
      console.log(e)
      setReloadingDatabase(false)
      toast({
        title: '❌ Reload Database Failed',
        description: e.message ?? 'Unknown Error',
        duration: 3000,
      })
    }
  }

  const onUpdateDatabase = async () => {
    setReloadingDatabase(true)
    await updateDatabaseOptions(form.getValues().notionKey)
    setReloadingDatabase(false)
  }

  const initConfig = async () => {
    const key = await getNotionKey()
    if (!key)
      return
    form.setValue('notionKey', key)
    await updateDatabaseOptions(key)
    const info = await getClipDatabaseInfo()
    console.log('info: ', info)
    if (info)
      form.setValue('database', info)
  }

  useEffect(() => {
    initConfig()
  }, [])

  async function onSave(data: z.infer<typeof FormSchema>) {
    setIsSaving(true)
    await setNotionKey(data.notionKey)
    await setClipDatabaseInfo(data.database)
    setTimeout(() => {
      setIsSaving(false)
    }, 500)
  }

  const onSelectClick = (selectedId: string) => {
    const database = databases.find(db => db.id === selectedId)
    if (database)
      form.setValue('database', database)
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
              <div className="flex flex-row gap-2 items-center">
                <FormLabel>Database</FormLabel>
                <div className="cursor-pointer hover:bg-[#F4F4F5] flex justify-center items-center p-2 rounded-md">
                  <UpdateIcon onClick={onUpdateDatabase} className={`h-4 w-4 spin ${reloadingDatabase ? 'animate-spin' : ''}`} />
                </div>
              </div>
              <DbSelect {...field} selectedId={field.value ? field.value.id : ''} options={databases} onSelect={onSelectClick} />
              <FormDescription>
                This is the database you want to clip to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isSaving
            ? (
              <div className="flex flex-row items-center">
                <TubeLoadingIcon />
                <span>Save...</span>
              </div>
              )
            : <span>Save</span>}
        </Button>
      </form>
      <Toaster />
    </Form>
  )
}
