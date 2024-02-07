import type { Meta, StoryFn } from '@storybook/react'
import { ClipperConfig, type ClipperConfigProps } from './index'

const meta: Meta<typeof ClipperConfig> = {
  title: 'ClipperConfig',
  component: ClipperConfig,
  tags: ['autodocs'],
}
export default meta

export const Default = {
  args: {
    getNotionKey: () => {
      return Promise.resolve('a notion key')
    },
    getClipDatabaseInfo: () => {
      return Promise.resolve('en')
    },
    setNotionKey: (key: string) => {
      return Promise.resolve()
    },
    setClipDatabaseInfo: (info: string) => {
      return Promise.resolve()
    },
  },
}
