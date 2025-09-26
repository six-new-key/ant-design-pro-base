<template>
  <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :theme="appStore.sidebarTheme"
    :inline-collapsed="appStore.sidebarCollapsed">
    <template v-for="route in visibleRoutes" :key="route.path">
      <!-- 有子菜单的情况 -->
      <a-sub-menu v-if="route.children && route.children.length > 0" :key="'sub-' + route.path">
        <template #icon>
          <component :is="route.meta?.icon" v-if="route.meta?.icon" />
        </template>
        <template #title>{{ route.meta?.title || route.name }}</template>

        <template v-for="child in route.children" :key="child.path">
          <!-- 二级子菜单 -->
          <a-sub-menu v-if="child.children && child.children.length > 0" :key="'sub-' + child.path">
            <template #icon>
              <component :is="child.meta?.icon" v-if="child.meta?.icon" />
            </template>
            <template #title>{{ child.meta?.title || child.name }}</template>

            <template v-for="grandChild in child.children" :key="grandChild.path">
              <!-- 三级子菜单 -->
              <a-sub-menu v-if="grandChild.children && grandChild.children.length > 0" :key="'sub-' + grandChild.path">
                <template #icon>
                  <component :is="grandChild.meta?.icon" v-if="grandChild.meta?.icon" />
                </template>
                <template #title>{{ grandChild.meta?.title || grandChild.name }}</template>

                <a-menu-item v-for="greatGrandChild in grandChild.children" :key="greatGrandChild.path"
                  v-show="!greatGrandChild.meta?.hidden">
                  <template #icon>
                    <component :is="greatGrandChild.meta?.icon" v-if="greatGrandChild.meta?.icon" />
                  </template>
                  <router-link :to="greatGrandChild.path">
                    {{ greatGrandChild.meta?.title || greatGrandChild.name }}
                  </router-link>
                </a-menu-item>
              </a-sub-menu>

              <!-- 二级菜单项 -->
              <a-menu-item v-else-if="!grandChild.meta?.hidden" :key="grandChild.path">
                <template #icon>
                  <component :is="grandChild.meta?.icon" v-if="grandChild.meta?.icon" />
                </template>
                <router-link :to="grandChild.path">
                  {{ grandChild.meta?.title || grandChild.name }}
                </router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>

          <!-- 一级子菜单项 -->
          <a-menu-item v-else-if="!child.meta?.hidden" :key="child.path">
            <template #icon>
              <component :is="child.meta?.icon" v-if="child.meta?.icon" />
            </template>
            <router-link :to="child.path">
              {{ child.meta?.title || child.name }}
            </router-link>
          </a-menu-item>
        </template>
      </a-sub-menu>

      <!-- 没有子菜单的情况 -->
      <a-menu-item v-else-if="!route.meta?.hidden" :key="route.path">
        <template #icon>
          <component :is="route.meta?.icon" v-if="route.meta?.icon" />
        </template>
        <router-link :to="route.path">
          {{ route.meta?.title || route.name }}
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
// 图标组件已在main.js中全局注册，无需单独导入
import { routes as allRoutes } from '@/router/routes'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const route = useRoute()
const selectedKeys = ref([route.path])
const openKeys = ref([])


// 获取用户登录状态
const getUserLoginStatus = () => {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

// 处理路由数据，添加图标组件
const visibleRoutes = computed(() => {
  return allRoutes
    .filter(route => {
      // 基础过滤条件
      const hasTitle = route.meta?.title
      const notHidden = !route.meta?.hidden
      const notRoot = route.path !== '/'

      // 权限检查：如果路由需要认证，检查用户是否已登录
      const hasPermission = !route.meta?.requiresAuth || getUserLoginStatus()

      return hasTitle && notHidden && notRoot && hasPermission
    })
    .sort((a, b) => {
      // 根据order属性排序，没有order的路由排在最后
      const orderA = a.meta?.order || 999
      const orderB = b.meta?.order || 999
      return orderA - orderB
    })
    .map(route => {
      const processRoute = (r) => {
        const processed = { ...r }
        // 直接使用meta.icon，无需映射
        // 递归处理子路由
        if (processed.children) {
          processed.children = processed.children
            .filter(child => !child.meta?.hidden)
            .map(processRoute)
        }
        return processed
      }
      return processRoute(route)
    })
})

// 根据当前路由自动展开菜单
const updateMenuState = (currentPath) => {
  selectedKeys.value = [currentPath]

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
  if (parentKeys.length > 0 && !appStore.sidebarCollapsed) {
    openKeys.value = parentKeys
  }
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  updateMenuState(newPath)
}, { immediate: true })

// 监听折叠状态变化
watch(() => appStore.sidebarCollapsed, (collapsed) => {
  if (collapsed) {
    openKeys.value = []
  } else {
    updateMenuState(route.path)
  }
})
</script>