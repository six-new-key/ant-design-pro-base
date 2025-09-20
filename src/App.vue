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
      colorBgLayout: appStore.themeMode === 'dark' ? "rgb(10, 10, 11)" : "#f5f5f5",
      colorBgContainer: appStore.themeMode === 'dark' ? "rgb(22, 22, 24)" : "#fff",
    },
    components: {
      Menu: {
        colorItemBgSelected: themeStore.primaryColorHex + '36',
        colorItemBgSelectedHorizontal: themeStore.primaryColorHex + '36',
      }
    }
  }
})
</script>

<style>
:where(.ant-layout .ant-layout-sider) {
  background: v-bind('appStore.themeMode === "dark" || appStore.sidebarTheme === "dark" ? "rgb(22, 22, 24)" : "#fff"') !important;
}

:where(.mixed-top-header.theme-mode-header) {
  background: v-bind('appStore.themeMode === "dark" || appStore.headerTheme === "dark" ? "rgb(22, 22, 24)" : "#fff"') !important;
}

:where(.topbar-header.theme-mode-header) {
  background: v-bind('appStore.themeMode === "dark" || appStore.headerTheme === "dark" ? "rgb(22, 22, 24)" : "#fff"') !important;
}

::-webkit-scrollbar {
  width: 4px !important;
  height: 0 !important;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: v-bind('appStore.themeMode === "dark" || appStore.sidebarTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e7e7e7"') !important;
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: v-bind('appStore.themeMode === "dark" || appStore.sidebarTheme === "dark" ? "rgba(255, 255, 255, 0.3)" : "#d3d3d3"') !important;
}

/*滚动条的上下两端的按钮*/
::-webkit-scrollbar-button {
  height: 0px;
  width: 0;
}
</style>
