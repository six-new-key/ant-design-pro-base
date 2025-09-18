import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const themeMode = ref('light') // 主题模式：light/dark
  const sidebarTheme = ref('dark') // 侧边栏/顶部主题：light/dark
  const language = ref('zh-CN')
  const layout = ref('sidebar') // 默认布局
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  
  // Getters
  const isLoading = computed(() => loading.value)
  const currentLayout = computed(() => layout.value)
  
  // Actions
  const setThemeMode = (newThemeMode) => {
    themeMode.value = newThemeMode
  }
  
  const setSidebarTheme = (newSidebarTheme) => {
    sidebarTheme.value = newSidebarTheme
  }
  
  const setLanguage = (newLanguage) => {
    language.value = newLanguage
  }
  
  const setLayout = (newLayout) => {
    layout.value = newLayout
  }
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  const setLoading = (isLoading) => {
    loading.value = isLoading
  }
  
  return {
    // State
    themeMode,
    sidebarTheme,
    language,
    layout,
    sidebarCollapsed,
    loading,
    // Getters
    isLoading,
    currentLayout,
    // Actions
    setThemeMode,
    setSidebarTheme,
    setLanguage,
    setLayout,
    toggleSidebar,
    setSidebarCollapsed,
    setLoading
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['themeMode', 'sidebarTheme', 'language', 'layout', 'sidebarCollapsed']
  }
})