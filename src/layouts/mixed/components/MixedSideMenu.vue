<template>
  <div class="mixed-side-menu">
    <!-- 侧边菜单 -->
    <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :theme="appStore.sidebarTheme"
      class="side-menu">
      <template v-for="route in visibleRoutes" :key="route.path">
        <!-- 有子菜单的情况 -->
        <a-sub-menu v-if="route.children && route.children.length > 0" :key="'sub-' + route.path">
          <template #icon>
            <component :is="route.meta?.icon" v-if="route.meta?.icon && route.meta.icon !== ''" />
          </template>
          <template #title>{{ route.meta?.title || route.name }}</template>

          <template v-for="child in route.children" :key="child.path">
            <a-sub-menu v-if="child.children && child.children.length > 0" :key="'sub-' + child.path">
              <template #icon>
                <component :is="child.meta?.icon" v-if="child.meta?.icon && child.meta.icon !== ''" />
              </template>
              <template #title>{{ child.meta?.title || child.name }}</template>

              <a-menu-item v-for="grandChild in child.children" :key="'item-' + grandChild.path"
                v-show="!grandChild.meta?.hidden">
                <template #icon>
                  <component :is="grandChild.meta?.icon" v-if="grandChild.meta?.icon && grandChild.meta.icon !== ''" />
                </template>
                <router-link :to="grandChild.path">
                  {{ grandChild.meta?.title || grandChild.name }}
                </router-link>
              </a-menu-item>
            </a-sub-menu>

            <a-menu-item v-else-if="!child.meta?.hidden" :key="'item-' + child.path">
              <template #icon>
                <component :is="child.meta?.icon" v-if="child.meta?.icon && child.meta.icon !== ''" />
              </template>
              <router-link :to="child.path">
                {{ child.meta?.title || child.name }}
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>

        <!-- 没有子菜单的情况 -->
        <a-menu-item v-else-if="!route.meta?.hidden" :key="'item-' + route.path">
          <template #icon>
            <component :is="route.meta?.icon" v-if="route.meta?.icon && route.meta.icon !== ''" />
          </template>
          <router-link :to="route.path">
            {{ route.meta?.title || route.name }}
          </router-link>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// 图标组件已在main.js中全局注册，无需单独导入
import { routes as allRoutes } from '@/router/routes'
import { useAppStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const selectedKeys = ref([route.path])
const openKeys = ref([])

// 图标映射已移除，直接使用meta.icon

// 获取用户登录状态
const getUserLoginStatus = () => {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

// 根据当前选中的顶部菜单获取对应的侧边栏菜单
const visibleRoutes = computed(() => {
  const currentTopMenuKey = appStore.currentTopMenu
  if (!currentTopMenuKey) {
    return []
  }

  // 找到对应的顶部菜单路由
  const topMenuRoute = allRoutes.find(route => route.path === currentTopMenuKey)
  if (!topMenuRoute || !topMenuRoute.children) {
    return []
  }

  // 处理子路由并过滤权限
  const processRoute = (r) => {
    const processed = { ...r }
    // 直接使用meta.icon，无需映射
    if (processed.children) {
      processed.children = processed.children
        .filter(child => {
          const hasPermission = !child.meta?.requiresAuth || getUserLoginStatus()
          return !child.meta?.hidden && hasPermission
        })
        .map(processRoute)
        .sort((a, b) => {
          const orderA = a.meta?.order || 999
          const orderB = b.meta?.order || 999
          return orderA - orderB
        })
    }
    return processed
  }

  return topMenuRoute.children
    .filter(route => {
      const hasPermission = !route.meta?.requiresAuth || getUserLoginStatus()
      return !route.meta?.hidden && hasPermission
    })
    .map(processRoute)
    .sort((a, b) => {
      const orderA = a.meta?.order || 999
      const orderB = b.meta?.order || 999
      return orderA - orderB
    })
})

// 根据当前路由自动展开菜单和设置选中状态
const updateMenuState = (currentPath) => {
  selectedKeys.value = ['item-' + currentPath]

  // 查找父级菜单并自动展开
  const findParentKeys = (routes, targetPath, parentKeys = []) => {
    for (const route of routes) {
      if (route.path === targetPath) {
        return parentKeys
      }
      if (route.children && route.children.length > 0) {
        const found = findParentKeys(route.children, targetPath, [...parentKeys, 'sub-' + route.path])
        if (found.length > 0) {
          return found
        }
      }
    }
    return []
  }

  const parentKeys = findParentKeys(visibleRoutes.value, currentPath)
  openKeys.value = parentKeys
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  updateMenuState(newPath)
}, { immediate: true })

// 监听顶部菜单变化，重置侧边栏状态
watch(() => appStore.currentTopMenu, () => {
  // 延迟执行，确保visibleRoutes已更新
  setTimeout(() => {
    updateMenuState(route.path)
  }, 0)

  // 如果当前路由不属于新选中的顶部菜单，则清空选中状态
  const currentTopMenuKey = appStore.currentTopMenu
  if (currentTopMenuKey && !route.path.startsWith(currentTopMenuKey)) {
    selectedKeys.value = []
  }
})
</script>

<style scoped lang="scss">
.mixed-side-menu {
  height: 100%;
  padding-top: 10px;

  .side-menu {
    height: 100%;
  }
}
</style>