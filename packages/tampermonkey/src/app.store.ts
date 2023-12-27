import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

interface FrameState {
  width: number
  height: number
  top: number
  left: number
  open: boolean
  position: string
}

export const frameState = useLocalStorage<FrameState>('__md-collector-frame__', {
  width: 80,
  height: 60,
  top: 0,
  left: 50,
  open: false,
  position: 'bottom',
})

export const panelVisible = ref(false)

interface AppState {
  selector: string
}

export const appState = useLocalStorage<AppState>('__md-collector-app__', {
  selector: '',
})
