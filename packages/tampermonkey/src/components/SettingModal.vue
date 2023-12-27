<script setup lang='ts'>
import { ref } from 'vue'
import { appState } from '../app.store'

const visible = defineModel<boolean>('visible', { local: true, default: false })
const selector = ref(appState.value.selector)

const hintStr = ref('')

function handleOk() {
  appState.value.selector = selector.value
  visible.value = false
}
</script>

<template>
  <Teleport v-if="visible" to="body">
    <div class="fixed left-1/2 top-1/2 w-300px border border-gray-400 rounded-12px bg-white p-6 shadow-lg -translate-x-1/2 -translate-y-1/2">
      <form class="flex flex-col gap-4">
        <div class="form-item">
          <label for="name">Enter selector </label>
          <input id="name" v-model="selector" type="text" name="name" required>
        </div>

        <div class="w-full flex items-center justify-center">
          <input class="w-200px" type="submit" value="OK" formmethod="dialog" @click.stop="handleOk">
        </div>

        <div v-if="hintStr">
          {{ hintStr }}
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style scoped>
.form-item {
  @apply flex flex-row gap-2px;
}

.form-item label {
  @apply w-150px;
}
.form-item input {
  @apply flex-1;
}
</style>
