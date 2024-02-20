import type { Meta } from '@storybook/react'
import { ClipperConfig } from './index'
import type { DatabaseInfo } from './index'

const meta: Meta<typeof ClipperConfig> = {
  title: 'ClipperConfig',
  component: ClipperConfig,
  tags: ['autodocs'],
}
export default meta

export const Default = {
  args: {
    getNotionKey: () => {
      const key = localStorage.getItem('test:notionKey')
      if (key)
        return Promise.resolve(key)
      return Promise.resolve(null)
    },
    getClipDatabaseInfo: () => {
      const res = localStorage.getItem('test:clipDatabaseInfo')
      if (res) {
        const info = JSON.parse(res) as DatabaseInfo
        return Promise.resolve(info)
      }
      return Promise.resolve(null)
      // return Promise.resolve({
      //   id: '1',
      //   name: 'test',
      //   icon: '🗃️',
      // })
    },
    setNotionKey: (key: string) => {
      localStorage.setItem('test:notionKey', key)
      return Promise.resolve()
    },
    setClipDatabaseInfo: (info: DatabaseInfo) => {
      localStorage.setItem('test:clipDatabaseInfo', JSON.stringify(info))
      return Promise.resolve()
    },
  },
}
