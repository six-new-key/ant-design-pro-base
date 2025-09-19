<template>
  <a-space :size="20">
    <!-- 全屏按钮 -->
    <a-tooltip title="全屏">
      <a-button type="text" :icon="h(FullscreenOutlined)" @click="toggleFullscreen" />
    </a-tooltip>

    <!-- 通知图标 -->
    <a-badge :count="5">
      <a-tooltip title="通知">
        <a-button type="text" :icon="h(BellOutlined)" @click="showNotifications" />
      </a-tooltip>
    </a-badge>

    <!-- 国际化切换 -->
    <a-dropdown arrow>
      <template #overlay>
        <a-menu @click="handleLanguageChange">
          <a-menu-item key="zh-CN">
            🇨🇳 简体中文
          </a-menu-item>
          <a-menu-item key="en-US">
            🇺🇸 English
          </a-menu-item>
        </a-menu>
      </template>
      <a-button type="text" :icon="h(GlobalOutlined)" />
    </a-dropdown>


    <!-- 用户头像下拉菜单 -->
    <a-dropdown arrow>
      <template #overlay>
        <a-menu @click="handleUserMenuClick">
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

      <a-button type="text" :icon="h(UserOutlined)" />
    </a-dropdown>
  </a-space>
</template>

<script setup>
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  FullscreenOutlined,
  GlobalOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useAppStore } from '@/stores'

const router = useRouter()
const currentLanguage = ref('zh-CN')
const appStore = useAppStore()

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

// 显示通知
const showNotifications = () => {
  Modal.info({
    title: '通知中心',
    content: '暂无新通知',
    okText: '确定'
  })
}

// 语言切换
const handleLanguageChange = ({ key }) => {
  currentLanguage.value = key
  const languageMap = {
    'zh-CN': '简体中文',
    'en-US': 'English'
  }
  message.success(`语言已切换为: ${languageMap[key]}`)
}

// 处理用户菜单点击
const handleUserMenuClick = ({ key }) => {
  switch (key) {
    case 'profile':
      router.push('/user/center')
      message.info('跳转到个人中心')
      break
    case 'settings':
      router.push('/user/settings')
      message.info('跳转到个人设置')
      break
    case 'logout':
      Modal.confirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('username')
          sessionStorage.removeItem('isLoggedIn')
          sessionStorage.removeItem('username')
          message.success('退出登录成功')
          router.push('/login')
        }
      })
      break
  }
}
</script>

<style scoped lang="scss">
.anticon {
  color: v-bind('appStore.headerTheme === "dark" ? "#fff" : ""');
}
</style>