<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

// 主题配置
const themeConfig = computed(() => {
  return {
    cssVar: true,
    algorithm: appStore.themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
})
</script>
