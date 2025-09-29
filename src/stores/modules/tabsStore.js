import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTabsStore = defineStore('tabs', () => {
  // State
  const tabs = ref([])
  const activeTabPath = ref('/dashboard')
  
  // 默认首页页签
  const defaultTab = {
    id: 'dashboard',
    title: '仪表盘',
    path: '/dashboard',
    icon: 'DashboardOutlined',
    closable: false,
    pinned: true,
    meta: { title: '仪表盘' }
  }

  // Getters
  const activeTabs = computed(() => tabs.value)
  const activeTab = computed(() => 
    tabs.value.find(tab => tab.path === activeTabPath.value)
  )
  const activeTabIndex = computed(() => 
    tabs.value.findIndex(tab => tab.path === activeTabPath.value)
  )

  // Actions
  const addTab = (route) => {
    const existingTab = tabs.value.find(tab => tab.path === route.path)
    
    if (!existingTab) {
      const newTab = {
        id: route.name || route.path.replace(/\//g, '-'),
        title: route.meta?.title || route.name || '未命名',
        path: route.path,
        icon: route.meta?.icon,
        closable: route.path !== '/dashboard', // 首页不可关闭
        pinned: route.path === '/dashboard', // 首页默认固定
        meta: route.meta || {}
      }
      
      tabs.value.push(newTab)
      
      // 如果新添加的页签是固定页签，需要重新排序
      if (newTab.pinned) {
        sortTabsByPinStatus()
      }
    }
    
    activeTabPath.value = route.path
  }

  const removeTab = (targetPath) => {
    const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
    
    if (targetIndex === -1) return
    
    const targetTab = tabs.value[targetIndex]
    
    // 固定页签不能关闭
    if (targetTab.pinned || !targetTab.closable) return
    
    tabs.value.splice(targetIndex, 1)
    
    // 如果关闭的是当前激活页签，需要切换到其他页签
    if (activeTabPath.value === targetPath) {
      if (tabs.value.length > 0) {
        // 优先切换到右侧页签，如果没有则切换到左侧
        const nextTab = tabs.value[targetIndex] || tabs.value[targetIndex - 1]
        activeTabPath.value = nextTab.path
      } else {
        // 如果没有页签了，跳转到首页
        activeTabPath.value = '/dashboard'
        addTab({ path: '/dashboard', meta: { title: '仪表盘' } })
      }
    }
  }

  const setActiveTab = (path) => {
    activeTabPath.value = path
  }

  const toggleTabPin = (targetPath) => {
    const tab = tabs.value.find(tab => tab.path === targetPath)
    if (tab && tab.path !== '/dashboard') { // 首页固定状态不可更改
      tab.pinned = !tab.pinned
      tab.closable = !tab.pinned // 固定的页签不可关闭
      
      // 如果页签被设置为固定，自动排到前面
      if (tab.pinned) {
        sortTabsByPinStatus()
      }
    }
  }

  // 根据固定状态对页签进行排序
  const sortTabsByPinStatus = () => {
    tabs.value.sort((a, b) => {
      // 首页始终在最前面
      if (a.path === '/dashboard') return -1
      if (b.path === '/dashboard') return 1
      
      // 固定页签排在非固定页签前面
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      
      // 同类型页签保持原有顺序
      return 0
    })
  }

  const closeLeftTabs = (targetPath) => {
    const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
    if (targetIndex <= 0) return
    
    // 从右往左删除，避免索引变化问题
    for (let i = targetIndex - 1; i >= 0; i--) {
      const tab = tabs.value[i]
      if (tab.closable && !tab.pinned) {
        tabs.value.splice(i, 1)
      }
    }
  }

  const closeRightTabs = (targetPath) => {
    const targetIndex = tabs.value.findIndex(tab => tab.path === targetPath)
    if (targetIndex === -1 || targetIndex >= tabs.value.length - 1) return
    
    // 从右往左删除，避免索引变化问题
    for (let i = tabs.value.length - 1; i > targetIndex; i--) {
      const tab = tabs.value[i]
      if (tab.closable && !tab.pinned) {
        tabs.value.splice(i, 1)
      }
    }
  }

  const closeOtherTabs = (targetPath) => {
    tabs.value = tabs.value.filter(tab => 
      tab.path === targetPath || tab.pinned || !tab.closable
    )
  }

  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(tab => tab.pinned || !tab.closable)
    
    // 如果当前激活页签被关闭，切换到首页
    const activeTabExists = tabs.value.some(tab => tab.path === activeTabPath.value)
    if (!activeTabExists) {
      activeTabPath.value = '/dashboard'
      // 确保首页页签存在
      if (!tabs.value.some(tab => tab.path === '/dashboard')) {
        addTab({ path: '/dashboard', meta: { title: '仪表盘' } })
      }
    }
  }

  const initTabs = () => {
    // 初始化时确保首页页签存在
    if (!tabs.value.some(tab => tab.path === '/dashboard')) {
      tabs.value.unshift(defaultTab)
    }
  }

  return {
    // State
    tabs,
    activeTabPath,
    
    // Getters
    activeTabs,
    activeTab,
    activeTabIndex,
    
    // Actions
    addTab,
    removeTab,
    setActiveTab,
    toggleTabPin,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
    closeAllTabs,
    initTabs
  }
}, {
  persist: {
    storage: localStorage,
    paths: [
      'tabs',
      'activeTabPath'
    ]
  }
})