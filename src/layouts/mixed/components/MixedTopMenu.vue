<template>
  <div class="header-left">
    <div class="logo">
      <img src="/vite.svg" alt="logo" class="logo-img" />
      <span class="logo-text" :class="{ 'theme-mode-logo-text': appStore.headerTheme === 'dark' }">Ant Design
        Pro</span>
    </div>

    <!-- 水平导航菜单 -->
    <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="top-menu" @click="handleTopMenuClick"
      :theme="appStore.headerTheme">
      <a-menu-item v-for="item in topMenuItems" :key="item.key">
        <template #icon>
          <component :is="item.icon" v-if="item.icon" />
        </template>
        {{ item.label }}
      </a-menu-item>
    </a-menu>
  </div>

  <div class="header-right">
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes as allRoutes } from '@/router/routes'
import { useAppStore } from '@/stores'
import { theme } from 'ant-design-vue'

const { token } = theme.useToken()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const selectedKeys = ref([])

// 获取用户登录状态
const getUserLoginStatus = () => {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

// 顶部菜单项（显示一级菜单和有子菜单的父级菜单）
const topMenuItems = computed(() => {
  return allRoutes
    .filter(r => {
      // 基础过滤条件
      const hasTitle = r.meta?.title
      const notHidden = !r.meta?.hidden
      const notRoot = r.path !== '/'

      // 权限检查：如果路由需要认证，检查用户是否已登录
      const hasPermission = !r.meta?.requiresAuth || getUserLoginStatus()

      return hasTitle && notHidden && notRoot && hasPermission
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
      icon: r.meta.icon || null,
      route: r,
      hasChildren: r.children && r.children.length > 0
    }))
})

// 处理顶部菜单点击事件
const handleTopMenuClick = ({ key }) => {
  const menuItem = topMenuItems.value.find(item => item.key === key)
  if (menuItem) {
    // 如果是一级路由（没有子菜单），直接跳转
    if (!menuItem.hasChildren) {
      router.push(key)
    } else {
      // 如果有子菜单，跳转到第一个可访问的子路由
      const firstChild = findFirstAccessibleChild(menuItem.route)
      if (firstChild) {
        router.push(firstChild.path)
      }
    }

    // 通知侧边栏菜单更新
    appStore.setCurrentTopMenu(key)
  }
}

// 查找第一个可访问的子路由
const findFirstAccessibleChild = (route) => {
  if (!route.children || route.children.length === 0) {
    return route
  }

  for (const child of route.children) {
    if (!child.meta?.hidden && (!child.meta?.requiresAuth || getUserLoginStatus())) {
      if (child.children && child.children.length > 0) {
        return findFirstAccessibleChild(child)
      } else {
        return child
      }
    }
  }

  return null
}

// 搜索功能
const onSearch = (value) => {
  console.log('搜索:', value)
}

// 监听路由变化，更新选中的顶部菜单
watch(() => route.path, (newPath) => {
  // 根据当前路由找到对应的顶部菜单项
  const topMenuItem = topMenuItems.value.find(item => {
    if (item.key === newPath) {
      return true
    }
    // 检查是否是该菜单项的子路由
    if (item.hasChildren) {
      return newPath.startsWith(item.key)
    }
    return false
  })

  if (topMenuItem) {
    selectedKeys.value = [topMenuItem.key]
    appStore.setCurrentTopMenu(topMenuItem.key)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.header-left {
  display: flex;
  align-items: center;
  flex: 1;

  .logo {
    min-width: 200px;
    display: flex;
    align-items: center;

    .logo-img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 600;
      color: v-bind('token.colorText');

      &.theme-mode-logo-text {
        color: #fff;
      }
    }
  }

  .top-menu {
    flex: 1;
    border-bottom: none;
  }
}

.header-right {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 300px;
  background-color: yellow;

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
}
</style>