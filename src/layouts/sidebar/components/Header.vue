<template>
  <div class="header-left">
    <!-- 面包屑导航 -->
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path">
        <router-link v-if="item.path && item.path !== route.path" :to="item.path">
          {{ item.title }}
        </router-link>
        <span v-else>{{ item.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>

  <div class="header-right">
    <!-- 搜索框 -->
    <a-input-search placeholder="站内搜索" style="width: 200px; margin-right: 16px" @search="onSearch" />

    <!-- 全屏按钮 -->
    <a-tooltip title="全屏">
      <fullscreen-outlined class="header-icon" @click="toggleFullscreen" />
    </a-tooltip>

    <!-- 通知图标 -->
    <a-badge :count="5" style="margin: 0 16px">
      <a-tooltip title="通知">
        <bell-outlined class="header-icon" />
      </a-tooltip>
    </a-badge>

    <!-- 设置按钮 -->
    <a-tooltip title="设置">
      <setting-outlined class="header-icon" style="margin-right: 16px" />
    </a-tooltip>

    <!-- 用户头像下拉菜单 -->
    <a-dropdown>
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
      <div class="user-info">
        <a-avatar class="user-avatar">
          <template #icon><user-outlined /></template>
        </a-avatar>
        <span class="user-name">Admin</span>
        <down-outlined class="dropdown-icon" />
      </div>
    </a-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { routes as allRoutes } from '@/router/routes'

const route = useRoute()
const router = useRouter()

// 生成面包屑导航
const breadcrumbItems = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const items = []

  // 添加首页
  items.push({ title: '首页', path: '/dashboard' })

  // 添加匹配的路由
  matched.forEach(match => {
    if (match.path !== '/dashboard' && match.meta?.title) {
      items.push({
        title: match.meta.title,
        path: match.path
      })
    }
  })

  return items
})

// 搜索功能
const onSearch = (value) => {
  console.log('搜索:', value)
  message.info(`搜索: ${value}`)
}

// 全屏功能
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
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

.breadcrumb {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
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
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--ant-color-fill-tertiary);
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  margin-right: 8px;
  font-size: 14px;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--ant-color-text-secondary);
}
</style>