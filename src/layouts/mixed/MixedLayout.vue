<template>
  <a-layout style="height: 100vh;width: 100%;">
    <!-- 顶部导航栏 -->
    <a-layout-header class="mixed-top-header" :class="{ 'theme-mode-header': appStore.headerTheme === 'dark' }">
      <MixedTopMenu />
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider v-if="shouldShowSidebar" v-model:collapsed="collapsed" collapsible :width="sidebarWidth"
        :collapsedWidth="sidebarWidthCollapsed" :theme="appStore.sidebarTheme" class="mixed-sider">
        <MixedSideMenu :collapsed="collapsed" />
      </a-layout-sider>

      <!-- 主内容区域 -->
      <a-layout>
        <a-layout-content class="mixed-content">
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
import { theme } from 'ant-design-vue'
import { settings } from '@/settings'

const sidebarWidth = ref(settings.sidebarWidth)
const sidebarWidthCollapsed = ref(settings.sidebarWidthCollapsed)
const appStore = useAppStore()
const collapsed = ref(appStore.sidebarCollapsed)
const { token } = theme.useToken()

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
:where(.css-dev-only-do-not-override-1p3hq3p).ant-layout .ant-layout-header {
  padding: 0 $content-padding;
}

:where(.css-dev-only-do-not-override-13gz7x).ant-layout .ant-layout-header {
  padding: 0 $content-padding;
}

:where(.css-dev-only-do-not-override-13gz7x).ant-menu-horizontal {
  border: none;
}

.mixed-top-header {
  background: v-bind('token.colorBgContainer');
  display: flex;
  align-items: center;
  height: $top-height-horizontal;

  &.theme-mode-header {
    background-color: #001529;
  }
}

.mixed-sider {
  // background: #001529;
  // margin: 20px 0 20px 10px;
  // border-top-right-radius: 20px;
  // border-bottom-right-radius: 20px;
}

.mixed-content {
  padding: $content-padding;
  height: calc(100vh - $top-height-horizontal);
  overflow-y: scroll;
}
</style>