<template>
  <a-drawer
    :open="visible"
    @update:open="$emit('update:visible', $event)"
    title="系统配置"
    placement="right"
    :width="360"
    class="layout-drawer"
  >
    <div class="settings-content">
      <div class="section">
        <h3 class="section-title">布局风格</h3>
        <p class="section-desc">选择适合您的布局风格</p>
        
        <div class="layout-grid">
          <div 
            v-for="config in availableLayoutConfigs" 
            :key="config.key"
            class="layout-card"
            :class="{ active: currentLayout === config.key }"
            @click="handleLayoutSwitch(config.key)"
          >
            <div class="layout-preview">
              <div class="preview-container">
                <!-- 根据布局类型显示不同的预览图 -->
                <div v-if="config.key === 'sidebar'" class="preview-sidebar">
                  <div class="sidebar"></div>
                  <div class="content"></div>
                </div>
                <div v-else-if="config.key === 'topbar'" class="preview-topbar">
                  <div class="topbar"></div>
                  <div class="content"></div>
                </div>
                <div v-else-if="config.key === 'mixed'" class="preview-mixed">
                  <div class="topbar"></div>
                  <div class="main">
                    <div class="sidebar"></div>
                    <div class="content"></div>
                  </div>
                </div>
                <div v-else-if="config.key === 'minimal'" class="preview-minimal">
                  <div class="content full"></div>
                </div>
                <div v-else-if="config.key === 'card'" class="preview-card">
                  <div class="card-container">
                    <div class="card"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="layout-info">
              <h4 class="layout-name">{{ config.name }}</h4>
              <p class="layout-desc">{{ config.description }}</p>
            </div>
            
            <div v-if="currentLayout === config.key" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主题模式切换 -->
      <div class="section">
        <h3 class="section-title">主题模式</h3>
        <p class="section-desc">选择明亮或暗黑主题模式</p>
        
        <div class="theme-mode-grid">
          <div 
            class="theme-mode-card"
            :class="{ active: currentThemeMode === 'light' }"
            @click="handleThemeModeSwitch('light')"
          >
            <div class="theme-mode-preview light-preview">
              <div class="preview-header"></div>
              <div class="preview-body"></div>
            </div>
            <div class="theme-mode-info">
              <h4 class="theme-mode-name">明亮模式</h4>
              <p class="theme-mode-desc">适合白天使用的明亮主题</p>
            </div>
            <div v-if="currentThemeMode === 'light'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
          
          <div 
            class="theme-mode-card"
            :class="{ active: currentThemeMode === 'dark' }"
            @click="handleThemeModeSwitch('dark')"
          >
            <div class="theme-mode-preview dark-preview">
              <div class="preview-header"></div>
              <div class="preview-body"></div>
            </div>
            <div class="theme-mode-info">
              <h4 class="theme-mode-name">暗黑模式</h4>
              <p class="theme-mode-desc">适合夜间使用的暗黑主题</p>
            </div>
            <div v-if="currentThemeMode === 'dark'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 侧边栏主题切换 -->
      <div class="section">
        <h3 class="section-title">侧边栏主题</h3>
        <p class="section-desc">选择侧边栏和菜单的主题风格</p>
        
        <div class="sidebar-theme-grid">
          <div 
            class="sidebar-theme-card"
            :class="{ active: currentSidebarTheme === 'light' }"
            @click="handleSidebarThemeSwitch('light')"
          >
            <div class="sidebar-theme-preview light-sidebar">
              <div class="sidebar-preview"></div>
              <div class="content-preview"></div>
            </div>
            <div class="sidebar-theme-info">
              <h4 class="sidebar-theme-name">浅色侧边栏/顶部</h4>
              <p class="sidebar-theme-desc">明亮的侧边栏主题</p>
            </div>
            <div v-if="currentSidebarTheme === 'light'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
          
          <div 
            class="sidebar-theme-card"
            :class="{ active: currentSidebarTheme === 'dark' }"
            @click="handleSidebarThemeSwitch('dark')"
          >
            <div class="sidebar-theme-preview dark-sidebar">
              <div class="sidebar-preview"></div>
              <div class="content-preview"></div>
            </div>
            <div class="sidebar-theme-info">
              <h4 class="sidebar-theme-name">深色侧边栏/顶部</h4>
              <p class="sidebar-theme-desc">深色的侧边栏主题</p>
            </div>
            <div v-if="currentSidebarTheme === 'dark'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/stores'
import { getLayoutConfig } from '@/utils/layout.config.js'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  availableLayoutConfigs: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:visible', 'layout-switch'])

const appStore = useAppStore()

// 当前布局
const currentLayout = computed(() => appStore.layout)

// 当前布局配置
const currentLayoutConfig = computed(() => {
  return getLayoutConfig(currentLayout.value)
})

// 当前主题模式
const currentThemeMode = computed(() => appStore.themeMode || 'light')

// 当前侧边栏主题
const currentSidebarTheme = computed(() => appStore.sidebarTheme || 'light')

// 处理抽屉关闭
const handleClose = () => {
  emit('update:visible', false)
}

// 处理布局切换
const handleLayoutSwitch = (layoutKey) => {
  // 直接在子组件中处理布局切换
  appStore.setLayout(layoutKey)
  
  // 触发父组件的布局切换事件（用于显示加载状态）
  emit('layout-switch', layoutKey)
  
  handleClose()
}

// 处理主题模式切换
const handleThemeModeSwitch = (mode) => {
  appStore.setThemeMode(mode)
}

// 处理侧边栏主题切换
const handleSidebarThemeSwitch = (theme) => {
  appStore.setSidebarTheme(theme)
}
</script>

<style scoped>
.settings-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.section-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0 0 16px 0;
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.layout-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #fff;
}

.layout-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.layout-card.active {
  border-color: #1890ff;
  background: #f6ffed;
}

.layout-preview {
  margin-bottom: 8px;
}

.preview-container {
  width: 100%;
  height: 60px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  background: #fafafa;
}

/* 侧边栏布局预览 */
.preview-sidebar {
  display: flex;
  height: 100%;
}

.preview-sidebar .sidebar {
  width: 20px;
  background: #1890ff;
}

.preview-sidebar .content {
  flex: 1;
  background: #fff;
  margin: 4px;
  border-radius: 2px;
}

/* 顶部导航布局预览 */
.preview-topbar {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-topbar .topbar {
  height: 12px;
  background: #1890ff;
}

.preview-topbar .content {
  flex: 1;
  background: #fff;
  margin: 4px;
  border-radius: 2px;
}

/* 混合布局预览 */
.preview-mixed {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-mixed .topbar {
  height: 10px;
  background: #1890ff;
}

.preview-mixed .main {
  display: flex;
  flex: 1;
}

.preview-mixed .sidebar {
  width: 16px;
  background: #52c41a;
}

.preview-mixed .content {
  flex: 1;
  background: #fff;
  margin: 2px;
  border-radius: 2px;
}

/* 极简布局预览 */
.preview-minimal .content.full {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
}

/* 卡片布局预览 */
.preview-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.preview-card .card-container {
  width: 80%;
  height: 70%;
}

.preview-card .card {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  backdrop-filter: blur(10px);
}

.layout-info {
  text-align: center;
}

.layout-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.layout-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.active-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
}

/* 主题模式切换样式 */
.theme-mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-mode-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #fff;
}

.theme-mode-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.theme-mode-card.active {
  border-color: #1890ff;
  background: #f6ffed;
}

.theme-mode-preview {
  width: 100%;
  height: 60px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
}

.light-preview {
  background: #ffffff;
}

.light-preview .preview-header {
  height: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
}

.light-preview .preview-body {
  flex: 1;
  background: #ffffff;
  margin: 4px;
  border-radius: 2px;
}

.dark-preview {
  background: #1f1f1f;
}

.dark-preview .preview-header {
  height: 20px;
  background: #141414;
  border-bottom: 1px solid #303030;
}

.dark-preview .preview-body {
  flex: 1;
  background: #262626;
  margin: 4px;
  border-radius: 2px;
}

.theme-mode-info {
  text-align: center;
}

.theme-mode-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.theme-mode-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.3;
}

/* 侧边栏主题切换样式 */
.sidebar-theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.sidebar-theme-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #fff;
}

.sidebar-theme-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.sidebar-theme-card.active {
  border-color: #1890ff;
  background: #f6ffed;
}

.sidebar-theme-preview {
  width: 100%;
  height: 60px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
}

.light-sidebar .sidebar-preview {
  width: 20px;
  background: #ffffff;
  border-right: 1px solid #e8e8e8;
}

.light-sidebar .content-preview {
  flex: 1;
  background: #fafafa;
  margin: 4px;
  border-radius: 2px;
}

.dark-sidebar .sidebar-preview {
  width: 20px;
  background: #001529;
}

.dark-sidebar .content-preview {
  flex: 1;
  background: #f0f2f5;
  margin: 4px;
  border-radius: 2px;
}

.sidebar-theme-info {
  text-align: center;
}

.sidebar-theme-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.sidebar-theme-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.3;
}

</style>