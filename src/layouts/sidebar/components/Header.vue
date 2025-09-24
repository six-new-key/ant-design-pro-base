<template>
  <div class="header-left">
    <!-- 面包屑导航 -->
    <Breadcrumb strategy="matched" :show-home="true" />
  </div>

  <div class="header-right">
    <!-- 搜索框 -->
    <!-- <a-input-search placeholder="站内搜索" style="width: 200px; margin-right: 16px" @search="onSearch" /> -->

    <a-space :size="15">
      <!-- 刷新按钮 -->
      <a-tooltip title="刷新">
        <a-button type="text" :icon="h(SyncOutlined)" @click="handleRefresh" />
        <!-- <redo-outlined class="header-icon" @click="handleRefresh" /> -->
      </a-tooltip>

      <!-- 全屏按钮 -->
      <a-tooltip title="全屏">
        <a-button type="text" :icon="h(FullscreenOutlined)" @click="toggleFullscreen" />
        <!-- <fullscreen-outlined class="header-icon" @click="toggleFullscreen" /> -->
      </a-tooltip>

      <!-- 主题切换按钮 -->
      <a-button type="text" @click="toggleThemeMode(appStore.themeMode === 'dark' ? 'light' : 'dark')">
        <template #icon>
          <svg-icon :name="appStore.themeMode === 'dark' ? 'sun' : 'moon'" width="17px" height="17px"
            :color="appStore.themeMode === 'dark' ? '#fff' : '#2c2c2c'" />
        </template>
      </a-button>

      <!-- 语言切换按钮 -->
      <a-button type="text" :icon="h(FullscreenOutlined)" @click="toggleLanguage" />

      <!-- 通知图标 -->
      <!-- <a-badge :count="5" style="margin: 0 16px">
        <a-tooltip title="通知">
          <bell-outlined class="header-icon" />
        </a-tooltip>
      </a-badge> -->

      <!-- 用户头像下拉菜单 -->
      <a-dropdown>
        <div class="user-info">
          <a-avatar>
            <template #icon><user-outlined /></template>
          </a-avatar>
        </div>
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="profile">
              <user-outlined />
              个人中心
            </a-menu-item>
            <a-menu-item key="settings">
              <setting-outlined />
              个人设置
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout">
              <logout-outlined />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/core/Breadcrumb.vue'
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  DownOutlined,
  SyncOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

// 搜索功能
const onSearch = (value) => {
  console.log('搜索:', value)
  message.info(`搜索: ${value}`)
}

// 刷新功能
const handleRefresh = () => {
  window.location.reload()
}

// 全屏功能
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 主题切换
const toggleThemeMode = (themeMode) => {
  appStore.setThemeMode(themeMode)
}


// 语言切换
const toggleLanguage = () => {
  appStore.setLanguage(appStore.language === 'zh-CN' ? 'en-US' : 'zh-CN')
}

// 处理用户菜单点击
const handleMenuClick = ({ key }) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      // 这里应该调用登出逻辑
      message.success('退出登录成功')
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-icon {
  font-size: 16px;
  cursor: pointer;
  color: var(--ant-color-text-secondary);
  transition: color 0.3s;
  padding: 8px;
}

.header-icon:hover {
  color: var(--ant-color-primary);
}

.user-info {
  cursor: pointer;
}
</style>