<template>
  <a-layout style="min-height: 100vh">
    <!-- 顶部导航栏 -->
    <a-layout-header class="mixed-top-header">
      <MixedTopMenu />
    </a-layout-header>


    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider 
        v-if="shouldShowSidebar" 
        v-model:collapsed="collapsed" 
        :trigger="null" 
        collapsible 
        :width="224" 
        class="mixed-sider"
      >
        <MixedSideMenu :collapsed="collapsed" />
      </a-layout-sider>

      <!-- 主内容区域 -->
      <a-layout>
        <a-layout-content class="mixed-content" :class="{ 'no-sidebar': !shouldShowSidebar }">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAppStore } from '@/stores'
import { routes as allRoutes } from '@/router/routes'
import MixedTopMenu from './components/MixedTopMenu.vue'
import MixedSideMenu from './components/MixedSideMenu.vue'

const appStore = useAppStore()
const collapsed = ref(appStore.sidebarCollapsed)

// 判断当前选中的顶部菜单是否为一级路由（没有子菜单）
const shouldShowSidebar = computed(() => {
  const currentTopMenu = appStore.currentTopMenu
  if (!currentTopMenu) return true
  
  // 找到对应的路由配置
  const route = allRoutes.find(r => r.path === currentTopMenu)
  if (!route) return true
  
  // 如果没有子路由或子路由为空，则隐藏侧边栏
  return route.children && route.children.length > 0
})

// 监听侧边栏状态变化
watch(() => collapsed.value, (newVal) => {
  appStore.setSidebarCollapsed(newVal)
})
</script>

<style scoped lang="scss">
.mixed-top-header {
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.mixed-sider {
  background: #001529;
}

.mixed-content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}

.mixed-content.no-sidebar {
  margin: 24px;
}

.mixed-footer {
  text-align: center;
  background: #f0f2f5;
}
</style>