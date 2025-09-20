<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { useAppStore, useThemeStore } from '@/stores'

const appStore = useAppStore()

const themeStore = useThemeStore()

// 主题配置
const themeConfig = computed(() => {
  return {
    algorithm: appStore.themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: themeStore.primaryColorHex,
      colorInfo: themeStore.primaryColorHex,
      colorLink: themeStore.primaryColorHex
    },
    components:{
      Menu: {
        colorItemBgSelected: themeStore.primaryColorHex + '25',
        colorItemBgSelectedHorizontal: themeStore.primaryColorHex + '25',
        // colorItemBg: '#000'
      }
    }
  }
})
</script>
