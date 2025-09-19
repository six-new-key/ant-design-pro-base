<template>
  <a-layout style="height: 100vh;width: 100%;">
    <!-- 顶部导航栏 -->
    <a-layout-header class="topbar-header" :class="{'theme-mode-header': appStore.headerTheme === 'dark'}">
      <div class="header-left">
        <!-- Logo -->
        <div class="logo">
          <img src="/vite.svg" alt="logo" class="logo-img" />
          <span class="logo-text" :class="{'theme-mode-logo-text': appStore.headerTheme === 'dark'}">Ant Design Pro</span>
        </div>

        <!-- 顶部菜单 -->
        <div class="topbar-menu">
          <TopbarMenu />
        </div>
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

    <!-- 页脚 -->
    <!-- <a-layout-footer class="topbar-footer">
      Ant Design Pro ©2024 Created by Ant UED
    </a-layout-footer> -->
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
  width: 100%;
  display: flex;
  align-items: center;
  height: $top-height-horizontal;
  background: v-bind('token.colorBgContainer');

  &.theme-mode-header {
    background-color: #001529;
  }

  .header-left {
    width: 70%;

    .logo {
      float: left;
      display: flex;
      align-items: center;
      width: 200px;

      .logo-img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 600;
        color: v-bind('token.colorText');
        white-space: nowrap;

        &.theme-mode-logo-text {
          color: #fff;
        }
      }
    }

    .topbar-menu {
      flex: 1;
    }
  }

  .header-right {
    flex: 1;
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