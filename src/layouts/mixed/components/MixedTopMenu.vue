<template>
  <a-layout-header class="mixed-top-header">
    <div class="header-left">
      <div class="logo">
        <img src="/vite.svg" alt="logo" class="logo-img" />
        <span class="logo-text">Ant Design Pro</span>
      </div>
      
      <!-- 水平导航菜单 -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
        class="top-menu"
        :items="topMenuItems"
      />
    </div>
    
    <div class="header-right">
      <!-- 搜索框 -->
      <a-input-search
        placeholder="站内搜索"
        style="width: 200px; margin-right: 16px"
        @search="onSearch"
      />
      
      <!-- 通知图标 -->
      <a-badge :count="5" style="margin-right: 16px">
        <bell-outlined class="header-icon" />
      </a-badge>
      
      <!-- 用户头像下拉菜单 -->
      <a-dropdown>
        <template #overlay>
          <a-menu>
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
        <a-avatar class="user-avatar">
          <template #icon><user-outlined /></template>
        </a-avatar>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup>
import { ref, computed,watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { routes as allRoutes } from '@/router/routes'

const route = useRoute()
const router = useRouter()

const selectedKeys = ref([route.path])

// 获取用户登录状态
const getUserLoginStatus = () => {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

// 顶部菜单项（只显示一级菜单）
const topMenuItems = computed(() => {
  return allRoutes
    .filter(r => {
      // 基础过滤条件
      const hasTitle = r.meta?.title
      const notHidden = !r.meta?.hidden
      const hasChildren = r.children?.length > 0
      const notRoot = r.path !== '/'
      
      // 权限检查：如果路由需要认证，检查用户是否已登录
      const hasPermission = !r.meta?.requiresAuth || getUserLoginStatus()
      
      return hasTitle && notHidden && hasChildren && notRoot && hasPermission
    })
    .sort((a, b) => {
      // 根据order属性排序，没有order的路由排在最后
      const orderA = a.meta?.order || 999
      const orderB = b.meta?.order || 999
      return orderA - orderB
    })
    .map(r => ({
      key: r.path,
      label: r.meta.title,
      icon: r.meta.icon
    }))
})

// 搜索功能
const onSearch = (value) => {
  console.log('搜索:', value)
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
})
</script>

<style scoped>
.mixed-top-header {
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.top-menu {
  flex: 1;
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #1890ff;
}

.user-avatar {
  cursor: pointer;
}
</style>