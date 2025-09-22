<template>
  <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" :theme="appStore.headerTheme">
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

            <a-menu-item v-for="grandChild in child.children" :key="grandChild.path" v-show="!grandChild.meta?.hidden">
              <template #icon>
                <component :is="grandChild.meta?.icon" v-if="grandChild.meta?.icon" />
              </template>
              <router-link :to="grandChild.path">
                {{ grandChild.meta?.title || grandChild.name }}
              </router-link>
            </a-menu-item>
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

const route = useRoute()
const selectedKeys = ref([route.path])
const appStore = useAppStore()

// 图标映射已移除，直接使用meta.icon

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

// 监听路由变化
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]

  // 对于顶部菜单，需要找到顶级路由作为选中项
  const findTopLevelRoute = (routes, targetPath) => {
    for (const r of routes) {
      if (r.path === targetPath) {
        return r.path
      }
      if (r.children) {
        const found = findChildRoute(r.children, targetPath)
        if (found) {
          return r.path
        }
      }
    }
    return targetPath
  }

  const findChildRoute = (children, targetPath) => {
    for (const child of children) {
      if (child.path === targetPath) {
        return true
      }
      if (child.children) {
        const found = findChildRoute(child.children, targetPath)
        if (found) {
          return true
        }
      }
    }
    return false
  }

  const topLevelRoute = findTopLevelRoute(visibleRoutes.value, newPath)
  selectedKeys.value = [topLevelRoute]
}, { immediate: true })
</script>