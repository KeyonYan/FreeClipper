import { useEventListener, useKeyPress, useUpdateEffect } from 'ahooks'
import { useState } from 'react'
import { Toaster } from '../ui/toaster'
import { useToast } from '../ui/use-toast'
import './index.css'
import type { DatabaseInfo } from '../clipper-config'
import { ToastAction } from '../ui/toast'
import { parse2Block } from './dom-parser'

function getDomPropertyValue(target: HTMLElement, property: string) {
  const computedStyle = window.getComputedStyle(target)
  return computedStyle.getPropertyValue(property)
}

function getBatchDomPropertyValue(target: HTMLElement, properties: string[]) {
  const result: string[] = []
  for (const property of properties)
    result.push(getDomPropertyValue(target, property))
  return result
}

export interface ClipResult {
  success: boolean
  message: string
  url?: string
}

interface DomInspectorProps {
  toggleHotKey: string
  levelUpHotKey: string
  levelDownHotKey: string
  getNotionKey: () => Promise<string | null>
  getClipDatabaseInfo: () => Promise<DatabaseInfo | null>
  onClip: (blocks: any, notionKey: string, clipDatabaseId: string, title: string) => Promise<ClipResult>
}

export function DomInspector(props: DomInspectorProps) {
  const { toggleHotKey, levelUpHotKey, levelDownHotKey, getNotionKey, getClipDatabaseInfo, onClip } = props
  const [positionCssMap, setPositionCssMap] = useState<Record<'container' | 'margin' | 'border' | 'padding', Record<string, string>>>({
    container: {},
    margin: {},
    border: {},
    padding: {},
  })
  const [enableInspect, setEnableInspect] = useState<boolean>(false)
  const [infoClassName, setInfoClassName] = useState<string>('')
  const [showInspectContainer, setShowInspectContainer] = useState<boolean>(false)
  const [isClipping, setIsClipping] = useState<boolean>(false)
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)
  const [hoveredHistoryElements, setHoveredHistoryElements] = useState<HTMLElement[]>([])
  const [preUserSelect, setPreUserSelect] = useState<string>('')
  const { toast } = useToast()

  const renderCover = () => {
    if (!hoveredElement) {
      setShowInspectContainer(false)
      document.body.style.userSelect = preUserSelect
      setPreUserSelect('')
      return
    }
    setShowInspectContainer(true)
    if (!preUserSelect)
      setPreUserSelect(getComputedStyle(document.body).userSelect)
    const target = hoveredElement
    const { top, right, bottom, left } = target.getBoundingClientRect()

    const [bt, br, bb, bl] = getBatchDomPropertyValue(target, ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'])
    const [pt, pr, pb, pl] = getBatchDomPropertyValue(target, ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'])
    const [mt, mr, mb, ml] = getBatchDomPropertyValue(target, ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'])

    setPositionCssMap({
      container: {
        '--top': `${top}px`,
        '--left': `${left}px`,
        '--bottom': `${bottom}px`,
        '--right': `${right}px`,
        '--mt': mt,
        '--mr': mr,
        '--mb': mb,
        '--ml': ml,
        '--bt': bt,
        '--br': br,
        '--bb': bb,
        '--bl': bl,
        '--pt': pt,
        '--pr': pr,
        '--pb': pb,
        '--pl': pl,
        'top': `calc(var(--top) - var(--mt))`,
        'left': `calc(var(--left) - var(--ml))`,
        'height': `calc(var(--bottom) - var(--top) + var(--mb) + var(--mt))`,
        'width': `calc(var(--right) - var(--left) + var(--mr) + var(--ml))`,
      },
      margin: {
        borderWidth: `var(--mt) var(--mr) var(--mb) var(--ml)`,
      },
      border: {
        borderWidth: `var(--bt) var(--br) var(--bb) var(--bl)`,
      },
      padding: {
        borderWidth: `var(--pt) var(--pr) var(--pb) var(--pl)`,
      },
    })

    const browserHeight = document.documentElement.clientHeight // 浏览器高度
    // 自动调整信息弹出位置
    const bottomToViewPort = browserHeight - bottom - Number(mb.replace('px', ''))

    const topToViewPort = top - Number(mt.replace('px', ''))

    setInfoClassName(
      topToViewPort > bottomToViewPort
        ? topToViewPort < 100
          ? 'element-info-top-inner'
          : 'element-info-top'
        : bottomToViewPort < 100
          ? 'element-info-bottom-inner'
          : 'element-info-bottom',
    )
  }

  useUpdateEffect(() => {
    renderCover()
  }, [hoveredElement])

  const removeHoveredElement = () => {
    setHoveredElement(null)
    setHoveredHistoryElements([])
  }

  useKeyPress(toggleHotKey, () => {
    if (!enableInspect)
      setEnableInspect(true)
  }, { events: ['keydown'] })

  useKeyPress(toggleHotKey, () => {
    if (enableInspect) {
      setEnableInspect(false)
      removeHoveredElement()
    }
  }, { events: ['keyup'] })

  useKeyPress(levelUpHotKey, () => {
    if (!enableInspect || !hoveredElement)
      return
    const parentNode = hoveredElement.parentElement
    if (parentNode) {
      setHoveredHistoryElements([...hoveredHistoryElements, hoveredElement])
      setHoveredElement(parentNode)
    }
  })

  useKeyPress(levelDownHotKey, () => {
    if (!enableInspect || !hoveredElement)
      return
    const historyNode = hoveredHistoryElements.pop()
    if (historyNode) {
      setHoveredElement(historyNode)
      setHoveredHistoryElements(hoveredHistoryElements)
    }
    else {
      const newHoveredElement = (hoveredElement.children[0] as HTMLElement) ?? hoveredElement
      setHoveredElement(newHoveredElement)
    }
  })

  useEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (!enableInspect) {
        removeHoveredElement()
        return
      }
      const targetNode = e.target as HTMLElement
      if (targetNode !== hoveredElement) {
        setHoveredElement(targetNode)
        setHoveredHistoryElements([])
      }
    },
    { target: document.body },
  )

  useEventListener(
    'mouseleave',
    (e: MouseEvent) => {
      if (!enableInspect)
        removeHoveredElement()
    },
    { target: document.body },
  )

  useEventListener(
    'click',
    async (e) => {
      if (!enableInspect || !showInspectContainer)
        return
      console.log('click')
      e.stopPropagation()
      e.preventDefault()
      console.log(hoveredElement)
      setIsClipping(true)
      const notionKey = await getNotionKey()
      const clipDatabaseInfo = await getClipDatabaseInfo()
      if (notionKey === null || clipDatabaseInfo === null) {
        toast({
          title: '❌ Clip Failed',
          description: `NotionKey or ClipDatabaseInfo is not set. Please set them in the extension.`,
          duration: 3000,
        })
        return
      }

      toast({
        title: '✂ isClipping',
        description: `Clipping to database ${clipDatabaseInfo.name}`,
        duration: 3000,
      })
      const blocks = parse2Block(hoveredElement as HTMLElement)
      console.log(blocks)
      // const uploadRes = await uploadToNotion(blocks, notionKey, clipDataseInfo.id)
      const uploadRes = await onClip(blocks, notionKey, clipDatabaseInfo.id, document.title)
      console.log('core:uploadRes', uploadRes)
      if (uploadRes?.success) {
        toast({
          title: '✅ Clip Success',
          description: `Open the notion page`,
          duration: 3000,
          action: <ToastAction altText="Open" onClick={() => window.open(uploadRes.url)}>Open</ToastAction>,
        })
      }
      else {
        toast({
          title: `❌ Clip Failed`,
          description: `${uploadRes.message ?? 'Unknown Error'}`,
          duration: 3000,
        })
      }
      removeHoveredElement()
      setEnableInspect(false)
    },
    { target: document.body },
  )

  return (
    <div>
      <div
        className={`pointer-events-none transition-all fixed z-[99999] border border-blue-500 rounded-sm ${hoveredElement ? 'block' : 'hidden'}`}
        style={positionCssMap.container}
      >
        <div className="border-[rgba(255,155,0,0.3)] absolute inset-0" style={positionCssMap.margin}>
          <div className="border-[rgba(255,200,50,0.3)] absolute inset-0" style={positionCssMap.border}>
            <div className="border-[rgba(77,200,0,0.3)] absolute inset-0" style={positionCssMap.padding}>
              <div className="bg-[rgba(120,170,210,0.7)] absolute inset-0"></div>
            </div>
          </div>
        </div>
        <div
          className={`absolute ${infoClassName} left-1/2 -translate-x-1/2`}
        >
          <div className="max-w-full text-sm bg-sky-600 text-red break-all shadow py-1 px-2 rounded">
            Click to Clip
            {' '}
            {hoveredElement?.className}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
