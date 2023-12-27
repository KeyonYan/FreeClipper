<script setup lang='ts'>
import { ref } from 'vue'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { usePanelVisible, usePosition } from '../app.composables'
import { appState } from '../app.store'
import SettingModal from './SettingModal.vue'

const panelEl = ref()
const { onPointerDown, anchorStyle, isHidden, isDragging, isVertical, panelStyle } = usePosition(panelEl)

const { togglePanelVisible, closePanel, panelVisible } = usePanelVisible()
async function handleCopy() {
  const markdownDom = document.querySelector(appState.value.selector)
  if (!markdownDom) {
    alert(`selector ${appState.value.selector} not found`)
    return
  }

  const translateStr = NodeHtmlMarkdown.translate(
  /* html */ markdownDom.innerHTML,
    /* options (optional) */ {},
    /* customTranslators (optional) */ undefined,
    /* customCodeBlockTranslators (optional) */ undefined,
  )
  console.log(translateStr)

  await navigator.clipboard.writeText(translateStr)
  alert('success')
}
</script>

<template>
  <div
    id="vue-devtools-anchor"
    :style="anchorStyle"
    :class="{
      'vue-devtools-vertical': isVertical,
      'vue-devtools-hide': isHidden,
    }"
    class="fixed z-1000 origin-center -translate-x-1/2 -translate-y-1/2"
  >
    <div
      ref="panelEl"
      class="vue-devtools-panel absolute h-20px flex items-center justify-start gap-2px overflow-hidden rounded-20px p-4px"
      :style="panelStyle"
      @pointerdown="onPointerDown"
    >
      <div
        class="vue-devtools-icon-button vue-devtools-vue-button"
        title="Toggle Vue DevTools"
        @click="togglePanelVisible"
      >
        <div class="i-mdi-apple-keyboard-option" />
      </div>
      <div
        class="vue-devtools-panel-content h-12px w-1px bg-gray-300"
      />
      <div
        class="vue-devtools-icon-button vue-devtools-panel-content"
        title="Toggle Component Inspector"
        @click="handleCopy"
      >
        <div class="i-mdi-eye-circle-outline" />
      </div>
    </div>
    <!-- iframe -->
    <!-- <Frame
      :style="iframeStyle" :is-dragging="isDragging"
      :client="{
        close: closePanel,
        inspector: {
          disable: disableInspector,
          isEnabled: ref(inspectorEnabled),
        },
        getIFrame: getIframe,
      }"
      :view-mode="panelState.viewMode"
    /> -->
  </div>
  <SettingModal v-model:visible="panelVisible" />
</template>

<style scoped>
#vue-devtools-anchor .vue-devtools-panel {
  @apply border border-solid border-gray-300 bg-white color-gray-800;
  backdrop-filter: blur(10px);
  user-select: none;
  max-width: 150px;
  transition: max-width 0.4s ease, padding 0.5s ease, transform 0.3s ease, all 0.4s ease;
}

#vue-devtools-anchor.vue-devtools-hide .vue-devtools-panel {
  max-width: 30px;
}

#vue-devtools-anchor .vue-devtools-panel-content {
  transition: opacity 0.4s ease;
}

#vue-devtools-anchor .vue-devtools-hide .vue-devtools-panel-content {
  opacity: 0;
}

#vue-devtools-anchor.vue-devtools-vertical .vue-devtools-panel {
  transform: translate(-50%, -50%) rotate(90deg);
}

#vue-devtools-anchor .vue-devtools-icon-button {
  @apply p-0 m-0 cursor-pointer outline-none color-inherit flex items-center justify-center rounded-full w-30px h-30px;

  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

#vue-devtools-anchor .vue-devtools-icon-button:hover {
  opacity: 1;
}

#vue-devtools-anchor .vue-devtools-vue-button {
  flex: none;
}

@media print {
  #vue-devtools-anchor {
    display: none;
  }
}
</style>
