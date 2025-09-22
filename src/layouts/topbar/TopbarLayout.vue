<template>
  <a-layout style="height: 100vh;width: 100%;">
    <!-- 顶部导航栏 -->
    <a-layout-header class="topbar-header" :class="{ 'theme-mode-header': appStore.headerTheme === 'dark' }">
      <div class="header-left">
        <div class="logo">
          <img src="/vite.svg" alt="logo" class="logo-img" />
          <span class="logo-text" :class="{ 'theme-mode-logo-text': appStore.headerTheme === 'dark' }">Ant Design
            Pro</span>
        </div>
      </div>

      <div class="topbar-menu">
        <TopbarMenu />
      </div>

      <div class="header-right">
        <!-- 头部操作区 -->
        <HeaderActions />
      </div>
    </a-layout-header>

    <!-- 主内容区域 -->
    <a-layout-content class="topbar-content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import TopbarMenu from './components/TopbarMenu.vue'
import HeaderActions from './components/HeaderActions.vue'
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const { token } = theme.useToken()

</script>

<style scoped lang="scss">
.topbar-header {
  display: flex;
  align-items: center;
  height: $top-height-horizontal;
  background: v-bind('token.colorBgContainer');

  &.theme-mode-header {
    background: $component-bg-color;
  }

  .header-left {
    height: 100%;
    width: 15%;
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;

      .logo-img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }

      .logo-text {
        font-size: 20px;
        font-weight: 600;
        font-weight: bold;
        color: v-bind('token.colorText');
        white-space: nowrap;

        &.theme-mode-logo-text {
          color: #fff;
        }
      }
    }
  }

  .topbar-menu {
    width: 60%;
  }

  .header-right {
    height: 100%;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.topbar-content {
  padding: $content-padding;
  height: calc(100vh - $top-height-horizontal);
  overflow-y: scroll;
}

.topbar-footer {
  text-align: center;
  background: #f0f2f5;
}
</style>