import { computed, onMounted, reactive, ref } from 'vue'
import type { Ref } from 'vue'
import { useElementHover, useEventListener } from '@vueuse/core'
import { clamp } from './utils'
import { frameState, panelVisible } from './app.store'

const SNAP_THRESHOLD = 2

function snapToPoints(value: number) {
  if (value < 5)
    return 0
  if (value > 95)
    return 100
  if (Math.abs(value - 50) < SNAP_THRESHOLD)
    return 50
  return value
}

export function usePanelVisible() {
  const toggleVisible = () => {
    panelVisible.value = !panelVisible.value
  }

  const closePanel = () => {
    if (!panelVisible.value)
      return
    panelVisible.value = false
  }

  return {
    panelVisible,
    togglePanelVisible: toggleVisible,
    closePanel,
  }
}

export function usePosition(panelEl: Ref<HTMLElement | undefined>) {
  const isDragging = ref(false) // 是否正在拖拽

  const draggingOffset = reactive({ x: 0, y: 0 })
  const windowSize = reactive({ width: 0, height: 0 })
  const mousePosition = reactive({ x: 0, y: 0 })
  const panelMargins = reactive({
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
  })

  const onPointerDown = (e: PointerEvent) => {
    isDragging.value = true
    const { left, top, width, height } = panelEl.value!.getBoundingClientRect()
    draggingOffset.x = e.clientX - left - width / 2
    draggingOffset.y = e.clientY - top - height / 2
  }

  const setWindowSize = () => {
    windowSize.width = window.innerWidth
    windowSize.height = window.innerHeight
  }

  const isHovering = useElementHover(panelEl, { delayLeave: 500 })
  // const isHovering = ref(true)

  onMounted(() => {
    setWindowSize()

    useEventListener(window, 'resize', () => {
      setWindowSize()
    })

    useEventListener(window, 'pointerup', () => {
      isDragging.value = false
    })

    useEventListener(window, 'pointerleave', () => {
      isDragging.value = false
    })

    useEventListener(window, 'pointermove', (e) => {
      if (!isDragging.value)
        return

      const centerX = windowSize.width / 2
      const centerY = windowSize.height / 2

      const x = e.clientX - draggingOffset.x
      const y = e.clientY - draggingOffset.y

      mousePosition.x = x
      mousePosition.y = y

      // Get position
      const deg = Math.atan2(y - centerY, x - centerX)
      const HORIZONTAL_MARGIN = 70
      const TL = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, 0 - centerX)
      const TR = Math.atan2(0 - centerY + HORIZONTAL_MARGIN, windowSize.width - centerX)
      const BL = Math.atan2(windowSize.height - HORIZONTAL_MARGIN - centerY, 0 - centerX)
      const BR = Math.atan2(windowSize.height - HORIZONTAL_MARGIN - centerY, windowSize.width - centerX)

      frameState.value.position = (deg >= TL && deg <= TR)
        ? 'top'
        : (deg >= TR && deg <= BR)
            ? 'right'
            : (deg >= BR && deg <= BL)
                ? 'bottom'
                : 'left'

      frameState.value.left = snapToPoints(x / windowSize.width * 100)
      frameState.value.top = snapToPoints(y / windowSize.height * 100)
    })
  })

  const isVertical = computed(() => frameState.value.position === 'left' || frameState.value.position === 'right')
  const isHidden = computed(() => {
    return !isHovering.value && !isDragging.value && !panelVisible.value
  })

  const anchorPos = computed(() => {
    const halfWidth = (panelEl.value?.clientWidth || 0) / 2
    const halfHeight = (panelEl.value?.clientHeight || 0) / 2

    const left = frameState.value.left * windowSize.width / 100
    const top = frameState.value.top * windowSize.height / 100

    switch (frameState.value.position) {
      case 'top':
        return {
          left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
          top: panelMargins.top + halfHeight,
        }
      case 'right':
        return {
          left: windowSize.width - panelMargins.right - halfHeight,
          top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom),
        }
      case 'left':
        return {
          left: panelMargins.left + halfHeight,
          top: clamp(top, halfWidth + panelMargins.top, windowSize.height - halfWidth - panelMargins.bottom),
        }
      case 'bottom':
      default:
        return {
          left: clamp(left, halfWidth + panelMargins.left, windowSize.width - halfWidth - panelMargins.right),
          top: windowSize.height - panelMargins.bottom - halfHeight,
        }
    }
  })

  const anchorStyle = computed(() => ({ left: `${anchorPos.value.left}px`, top: `${anchorPos.value.top}px` }))

  const panelStyle = computed(() => {
    const style: any = {
      transform: isVertical.value
        ? `translate(${isHidden.value ? `calc(-50% ${frameState.value.position === 'right' ? '+' : '-'} 15px)` : '-50%'}, -50%) rotate(90deg)`
        : `translate(-50%, ${isHidden.value ? `calc(-50% ${frameState.value.position === 'top' ? '-' : '+'} 15px)` : '-50%'})`,
    }
    if (isHidden.value) {
      switch (frameState.value.position) {
        case 'top':
        case 'right':
          style.borderTopLeftRadius = '0'
          style.borderTopRightRadius = '0'
          break
        case 'bottom':
        case 'left':
          style.borderBottomLeftRadius = '0'
          style.borderBottomRightRadius = '0'
          break
      }
    }
    if (isDragging.value)
      style.transition = 'none !important'
    return style
  })

  return {
    isHidden,
    isDragging,
    isVertical,
    anchorStyle,
    panelStyle,
    onPointerDown,
  }
}
