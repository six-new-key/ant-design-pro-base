<template>
  <div class="first-column-menu">
    <a-menu v-model:selectedKeys="selectedKeys" mode="vertical" theme="dark" class="vertical-menu"
      @select="handleMenuSelect">
      <a-menu-item v-for="route in firstLevelRoutes" :key="route.path">
        <template #icon>
          <component :is="route.meta?.icon" v-if="route.meta?.icon" />
        </template>
        <div class="menu-title">{{ route.meta?.title || route.name }}</div>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore} from '@/stores'
// 图标组件已在main.js中全局注册，无需单独导入
import { routes as allRoutes } from '@/router/routes'

const emit = defineEmits(['menu-select'])
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()
const selectedKeys = ref([])

// 图标映射已移除，直接使用meta.icon

// 获取用户登录状态
const getUserLoginStatus = () => {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

// 第一级路由（一级路由或多级路由的父路由）
const firstLevelRoutes = computed(() => {
  return allRoutes
    .filter(route => {
      const hasTitle = route.meta?.title
      const notHidden = !route.meta?.hidden
      const notRoot = route.path !== '/'
      const hasPermission = !route.meta?.requiresAuth || getUserLoginStatus()
      return hasTitle && notHidden && notRoot && hasPermission
    })
    .sort((a, b) => {
      const orderA = a.meta?.order || 999
      const orderB = b.meta?.order || 999
      return orderA - orderB
    })
    .map(route => {
      const processed = { ...route }
      // 直接使用meta.icon，无需映射
      return processed
    })
})

// 处理菜单选择
const handleMenuSelect = ({ key }) => {
  const clickedRoute = firstLevelRoutes.value.find(route => route.path === key)
  if (!clickedRoute) return

  // 如果是一级路由（没有子路由），直接跳转
  if (!clickedRoute.children || clickedRoute.children.length === 0) {
    router.push(clickedRoute.path)
    emit('menu-select', null) // 不显示第二列
  } else {
    // 如果是多级路由，显示第二列菜单
    emit('menu-select', clickedRoute)
  }
}

// 根据当前路由设置选中状态
const updateSelectedKey = (currentPath) => {
  // 查找当前路由对应的第一级菜单
  for (const firstRoute of firstLevelRoutes.value) {
    if (currentPath === firstRoute.path) {
      selectedKeys.value = [firstRoute.path]
      emit('menu-select', firstRoute.children && firstRoute.children.length > 0 ? firstRoute : null)
      return
    }

    // 检查是否是子路由
    if (firstRoute.children) {
      const isChildRoute = firstRoute.children.some(child => {
        if (currentPath === child.path) return true
        if (child.children) {
          return child.children.some(grandChild => currentPath === grandChild.path)
        }
        return false
      })

      if (isChildRoute) {
        selectedKeys.value = [firstRoute.path]
        emit('menu-select', firstRoute)
        return
      }
    }
  }
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  updateSelectedKey(newPath)
}, { immediate: true })
</script>

<style scoped lang="scss">
.first-column-menu {
  height: calc(100vh - $top-height);
  overflow-y: auto;
}

//隐藏滚动条
::-webkit-scrollbar {
  display: none;
}

.vertical-menu {
  border: none;
  width: 100%;
  background: $bg-color !important;
  display: flex;
  flex-direction: column;
  align-items: center;

  :deep(.ant-menu-item) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px; // 设置固定宽度
    height: 56px; // 设置固定高度
    line-height: 1.2;

    .ant-menu-item-icon {
      margin-bottom: 8px;
    }

    .menu-title {
      width: 50px; // 设置具体宽度,考虑到padding的4px左右间距
      line-height: 1.2;
      font-size: v-bind('themeStore.baseConfig.fontSize + "px"');
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; // 文字溢出显示省略号
      box-sizing: border-box; // 确保padding计入宽度
    }
  }
}
</style>