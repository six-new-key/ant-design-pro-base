<template>
  <div class="header-actions">
    <!-- 搜索框 -->
    <a-input-search
      placeholder="站内搜索"
      style="width: 200px; margin-right: 16px"
      @search="onSearch"
    />
    
    <!-- 全屏按钮 -->
    <a-tooltip title="全屏">
      <fullscreen-outlined class="action-icon" @click="toggleFullscreen" />
    </a-tooltip>
    
    <!-- 通知图标 -->
    <a-badge :count="5" style="margin: 0 16px">
      <a-tooltip title="通知">
        <bell-outlined class="action-icon" @click="showNotifications" />
      </a-tooltip>
    </a-badge>
    
    <!-- 设置按钮 -->
    <a-tooltip title="设置">
      <setting-outlined class="action-icon" style="margin-right: 16px" @click="showSettings" />
    </a-tooltip>
    
    <!-- 国际化切换 -->
    <a-dropdown>
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
      <a-tooltip title="语言">
        <global-outlined class="action-icon" style="margin-right: 16px" />
      </a-tooltip>
    </a-dropdown>
    
    <!-- 用户头像下拉菜单 -->
    <a-dropdown>
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
      <div class="user-info">
        <a-avatar class="user-avatar">
          <template #icon><user-outlined /></template>
        </a-avatar>
        <span class="user-name">Admin</span>
        <down-outlined class="dropdown-icon" />
      </div>
    </a-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const router = useRouter()
const currentLanguage = ref('zh-CN')

// 搜索功能
const onSearch = (value) => {
  console.log('搜索:', value)
  message.info(`搜索: ${value}`)
}

// 全屏功能
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    message.success('已进入全屏模式')
  } else {
    document.exitFullscreen()
    message.success('已退出全屏模式')
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

// 显示设置
const showSettings = () => {
  Modal.info({
    title: '系统设置',
    content: '设置功能开发中...',
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
      router.push('/profile')
      message.info('跳转到个人中心')
      break
    case 'settings':
      router.push('/settings')
      message.info('跳转到个人设置')
      break
    case 'logout':
      Modal.confirm({
        title: '确认退出',
        content: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          message.success('退出登录成功')
          router.push('/login')
        }
      })
      break
  }
}
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
  padding: 8px;
  border-radius: 4px;
}

.action-icon:hover {
  color: #1890ff;
  background-color: #f5f5f5;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  margin-right: 8px;
  font-size: 14px;
  color: #333;
}

.dropdown-icon {
  font-size: 12px;
  color: #666;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header-actions :deep(.ant-input-search) {
    width: 120px !important;
  }
  
  .user-name {
    display: none;
  }
  
  .action-icon {
    padding: 4px;
  }
}

@media (max-width: 480px) {
  .header-actions :deep(.ant-input-search) {
    display: none;
  }
}
</style>