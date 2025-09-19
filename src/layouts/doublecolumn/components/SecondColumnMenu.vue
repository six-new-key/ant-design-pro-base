<template>
  <div class="second-column-menu" v-if="parentRoute">
    <!-- 项目名称 -->
    <transition name="slide-fade">
      <div v-if="!appStore.sidebarCollapsed" class="project-title"
        :class="{ 'text-white': appStore.sidebarTheme === 'dark' }">
        Ant Design Pro
      </div>
    </transition>

    <!-- 子菜单列表 -->
    <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" :theme="appStore.sidebarTheme"
      class="sub-menu">
      <template v-for="child in visibleChildren" :key="child.path">
        <!-- 有子菜单的情况 -->
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

        <!-- 没有子菜单的情况 -->
        <a-menu-item v-else-if="!child.meta?.hidden" :key="child.path">
          <template #icon>
            <component :is="child.meta?.icon" v-if="child.meta?.icon" />
          </template>
          <router-link :to="child.path">
            {{ child.meta?.title || child.name }}
          </router-link>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import {
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
  MenuOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
  ProjectOutlined,
  StopOutlined,
  FileUnknownOutlined,
  DisconnectOutlined,
  NodeIndexOutlined,
  ShareAltOutlined
} from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'

const props = defineProps({
  parentRoute: {
    type: Object,
    default: null
  }
})

const { token } = theme.useToken()
const appStore = useAppStore()
const route = useRoute()
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
  MenuOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
  ProjectOutlined,
  StopOutlined,
  FileUnknownOutlined,
  DisconnectOutlined,
  NodeIndexOutlined,
  ShareAltOutlined
}

// 处理可见的子路由
const visibleChildren = computed(() => {
  if (!props.parentRoute || !props.parentRoute.children) {
    return []
  }

  const processRoute = (r) => {
    const processed = { ...r }
    // 处理图标
    if (processed.meta?.icon && iconMap[processed.meta.icon]) {
      processed.meta.icon = iconMap[processed.meta.icon]
    }
    // 递归处理子路由
    if (processed.children) {
      processed.children = processed.children
        .filter(child => !child.meta?.hidden)
        .map(processRoute)
    }
    return processed
  }

  return props.parentRoute.children
    .filter(child => !child.meta?.hidden)
    .sort((a, b) => {
      const orderA = a.meta?.order || 999
      const orderB = b.meta?.order || 999
      return orderA - orderB
    })
    .map(processRoute)
})

// 根据当前路由自动展开菜单和设置选中状态
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

  const parentKeys = findParentKeys(visibleChildren.value, currentPath)
  openKeys.value = parentKeys
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  updateMenuState(newPath)
}, { immediate: true })

// 监听父路由变化，重置菜单状态
watch(() => props.parentRoute, () => {
  if (props.parentRoute) {
    updateMenuState(route.path)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.second-column-menu {
  height: 100%;
  overflow-y: auto;
}

.project-title {
  height: $top-height;
  display: flex;
  padding-left: 26px;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: v-bind('token.colorText');

  &.text-white {
    color: #fff;
  }
}

/* 从左至右滑入动画 */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.sub-menu {
  border: none;
  background: transparent;
}
</style>