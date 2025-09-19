<template>
  <div class="double-column-header">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 收缩 -->
      <!-- <div class="toggle-collapse">
        <a-button type="text" @click="toggleCollapse">
          <template #icon>
            <MenuUnfoldOutlined v-if="!collapsed" />
            <MenuFoldOutlined v-else />
          </template>
        </a-button>
      </div> -->

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

    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 设置按钮 -->
      <a-tooltip title="布局设置">
        <a-button type="text" @click="showSettings">
          <template #icon>
            <SettingOutlined />
          </template>
        </a-button>
      </a-tooltip>

      <!-- 用户头像和下拉菜单 -->
      <a-dropdown placement="bottomRight">
        <div class="user-info">
          <a-avatar size="small" style="background-color: #1890ff">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span class="username">管理员</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">
              <UserOutlined />
              个人中心
            </a-menu-item>
            <a-menu-item key="settings">
              <SettingOutlined />
              个人设置
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <LogoutOutlined />
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { routes as allRoutes } from '@/router/routes'
import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const collapsed = ref(appStore.sidebarCollapsed)

// 生成面包屑导航
const breadcrumbItems = computed(() => {
  const items = []
  const currentPath = route.path

  // 查找路由层级
  const findRouteHierarchy = (routes, targetPath, hierarchy = []) => {
    for (const route of routes) {
      const currentHierarchy = [...hierarchy, route]

      if (route.path === targetPath) {
        return currentHierarchy
      }

      if (route.children && route.children.length > 0) {
        const found = findRouteHierarchy(route.children, targetPath, currentHierarchy)
        if (found.length > 0) {
          return found
        }
      }
    }
    return []
  }

  const hierarchy = findRouteHierarchy(allRoutes, currentPath)

  return hierarchy.map(route => ({
    title: route.meta?.title || route.name,
    path: route.path
  }))
})

// 切换收缩状态
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  appStore.setSidebarCollapsed(collapsed.value)
}

// 显示设置面板
const showSettings = () => {
  appStore.setSettingsDrawerVisible(true)
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.double-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;

  .toggle-collapse {
    margin-right: 12px;
  }
}

.breadcrumb {
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

.username {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
</style>