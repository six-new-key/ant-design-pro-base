<template>
  <a-layout style="height: 100vh;width: 100%;">
    <!-- 顶部导航栏 -->
    <a-layout-header class="mixed-top-header" :class="{ 'theme-mode-header': appStore.headerTheme === 'dark' }">
      <MixedTopMenu />
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏 -->
      <transition name="slide-fade">
        <a-layout-sider v-if="shouldShowSidebar" v-model:collapsed="collapsed" collapsible :width="sidebarWidth"
          :collapsedWidth="sidebarWidthCollapsed" :theme="appStore.sidebarTheme" class="mixed-sider"
          :class="{ 'mixed-sider-dark': appStore.sidebarTheme === 'dark' }">

          <MixedSideMenu />

          <template #trigger>
            <div class="custom-trigger"
              :class="{ 'collapsed': collapsed, 'theme-mode-trigger': appStore.sidebarTheme === 'dark' }">
              <a-button type="text">
                <template #icon>
                  <DoubleLeftOutlined style="font-size: 11px;" v-if="!collapsed" />
                  <DoubleRightOutlined style="font-size: 11px;" v-else />
                </template>
              </a-button>
            </div>
          </template>
        </a-layout-sider>
      </transition>

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
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'

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
.mixed-top-header {
  background: v-bind('token.colorBgContainer');
  display: flex;
  align-items: center;
  height: $top-height-horizontal;
  border-bottom: 1px solid v-bind('token.colorFillSecondary');

  &.theme-mode-header {
    background-color: #001529;
  }
}

.mixed-sider {

  &.mixed-sider-dark {
    border-top: 1px solid #414141;
  }

  .custom-trigger {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 10px;

    &.collapsed {
      padding-left: 0;
      justify-content: center;
    }

    &.theme-mode-trigger {
      background-color: #001529;

      :where(.css-dev-only-do-not-override-1p3hq3p).ant-btn {
        background: #002342;
      }

      :where(.css-dev-only-do-not-override-1p3hq3p).ant-btn:hover {
        background: #002f59;
      }

      :where(.css-dev-only-do-not-override-1p3hq3p).ant-btn>span {
        color: #fff;
      }
    }
  }
}

/* 从左至右滑入动画 */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.mixed-content {
  padding: $content-padding;
  height: calc(100vh - $top-height-horizontal);
  overflow-y: scroll;
}
</style>