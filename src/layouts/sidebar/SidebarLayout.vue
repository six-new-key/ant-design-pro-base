<template>
  <a-layout style="height: 100vh;width: 100%;">
    <!-- 侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="sidebarWidth"
      :collapsedWidth="sidebarWidthCollapsed" class="sidebar-sider" :theme="appStore.sidebarTheme">
      <!-- Logo区域 -->
      <div class="logo-container">
        <div class="logo">
          <img src="/vite.svg" alt="logo" class="logo-img" />
          <span v-if="!collapsed" class="logo-text" :class="{ 'text-white': appStore.sidebarTheme === 'dark' }">Ant
            Design
            Pro</span>
        </div>
      </div>

      <!-- 侧边菜单 -->
      <Sidebar />
    </a-layout-sider>

    <!-- 主内容区域 -->
    <a-layout class="sidebar-layout" :class="{ 'right-collapsed': collapsed }">
      <!-- 头部 -->
      <a-layout-header class="sidebar-header">
        <Header :collapsed="collapsed" @toggle="toggleCollapse" />
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="sidebar-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import { settings } from '@/settings'
import { theme } from 'ant-design-vue'

const sidebarWidth = ref(settings.sidebarWidth)
const sidebarWidthCollapsed = ref(settings.sidebarWidthCollapsed)
const appStore = useAppStore()
const collapsed = ref(appStore.sidebarCollapsed)
const { token } = theme.useToken()

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  appStore.setSidebarCollapsed(collapsed.value)
}

// 监听store中的状态变化
watch(() => appStore.sidebarCollapsed, (newVal) => {
  collapsed.value = newVal
})
</script>

<style scoped lang="scss">
.sidebar-sider {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  border-right: 1px solid v-bind('token.colorBorderSecondary');
}

.sidebar-layout {
  height: 100vh;
  margin-left: $sidebar-width;
  width: 100%;

  &.right-collapsed {
    margin-left: $sidebar-width-collapsed;
  }
}

.sidebar-header {
  background: v-bind('token.colorBgContainer');
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: $top-height;
}

:where(.css-dev-only-do-not-override-1p3hq3p).ant-layout .ant-layout-header {
  padding: 0 10px;
}

:where(.css-dev-only-do-not-override-13gz7x).ant-layout .ant-layout-header {
  padding: 0 10px;
}

.sidebar-content {
  height: calc(100vh - $top-height);
  overflow-y: scroll;
  width: 100%;
  padding: 20px;
}

.logo-container {
  height: $logo-height;
  display: flex;
  justify-content: center;
  width: 100%;

  .logo {
    padding: 10px 0;

    .logo-img {
      width: 32px;
      height: 32px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: v-bind('token.colorText');
      white-space: nowrap;
      margin-left: 12px;

      &.text-white {
        color: #fff;
      }
    }
  }
}
</style>