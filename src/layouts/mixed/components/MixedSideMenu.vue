<template>
  <div class="mixed-side-menu">
    <!-- 折叠按钮 -->
    <div class="collapse-trigger" @click="toggleCollapse">
      <menu-unfold-outlined v-if="collapsed" />
      <menu-fold-outlined v-else />
    </div>
    
    <!-- 侧边菜单 -->
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      class="side-menu"
    >
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
              
              <a-menu-item v-for="grandChild in child.children" :key="grandChild.path" v-show="!grandChild.meta?.hidden">
                <template #icon>
                  <component :is="grandChild.meta?.icon" v-if="grandChild.meta?.icon && grandChild.meta.icon !== ''" />
                </template>
                <router-link :to="grandChild.path">
                  {{ grandChild.meta?.title || grandChild.name }}
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <a-menu-item v-else-if="!child.meta?.hidden" :key="child.path">
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
        <a-menu-item v-else-if="!route.meta?.hidden" :key="route.path">
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
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  FormOutlined,
  TableOutlined,
  ProfileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  SettingOutlined,
  EditOutlined,
  MenuOutlined
} from '@ant-design/icons-vue'
import { routes as allRoutes } from '@/router/routes'
import { useAppStore } from '@/stores'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const selectedKeys = ref([route.path])
const openKeys = ref([])

// 图标映射
const iconMap = {
  DashboardOutlined,
  FormOutlined,
  TableOutlined,
  ProfileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  SettingOutlined,
  EditOutlined,
  MenuOutlined
}

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
        if (processed.meta?.icon && iconMap[processed.meta.icon]) {
          processed.meta.icon = iconMap[processed.meta.icon]
        }
        if (processed.children) {
          processed.children = processed.children.map(processRoute)
        }
        return processed
      }
      return processRoute(route)
    })
})

// 切换折叠状态
const toggleCollapse = () => {
  appStore.toggleSidebar()
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  selectedKeys.value = [newPath]
  
  // 自动展开包含当前路由的菜单
  const findParentKeys = (routes, targetPath, parentKey = '') => {
    for (const r of routes) {
      const currentKey = parentKey ? `${parentKey}-${r.path}` : r.path
      if (r.path === targetPath) {
        return parentKey ? [parentKey] : []
      }
      if (r.children) {
        const result = findParentKeys(r.children, targetPath, currentKey)
        if (result.length > 0) {
          return parentKey ? [parentKey, ...result] : result
        }
      }
    }
    return []
  }
  
  const parentKeys = findParentKeys(visibleRoutes.value, newPath)
  if (parentKeys.length > 0) {
    openKeys.value = parentKeys
  }
})
</script>

<style scoped>
.mixed-side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.collapse-trigger {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  border-bottom: 1px solid #001529;
  transition: background-color 0.3s;
}

.collapse-trigger:hover {
  background-color: #1890ff;
}

.side-menu {
  flex: 1;
  border-right: none;
}

.side-menu :deep(.ant-menu-item a),
.side-menu :deep(.ant-menu-submenu-title a) {
  color: inherit;
  text-decoration: none;
}

.side-menu :deep(.ant-menu-item a:hover),
.side-menu :deep(.ant-menu-submenu-title a:hover) {
  color: inherit;
}
</style>