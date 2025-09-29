<template>
  <a-drawer :open="visible" @update:open="$emit('update:visible', $event)" title="系统配置" placement="right" :width="360"
    class="layout-drawer">
    <div class="settings-content">
      <div class="section">
        <h3 class="section-title">布局风格</h3>
        <p class="section-desc">选择适合您的布局风格</p>

        <div class="layout-grid">
          <div v-for="config in availableLayoutConfigs" :key="config.key" class="layout-card"
            :class="{ active: currentLayout === config.key }" @click="handleLayoutSwitch(config.key)">
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
                <div v-else-if="config.key === 'fullscreen'" class="preview-fullscreen">
                  <div class="fullscreen-content">
                    <div class="floating-actions-preview">
                      <div class="floating-btn-preview"></div>
                      <div class="floating-btn-preview"></div>
                      <div class="floating-btn-preview"></div>
                    </div>
                  </div>
                </div>
                <div v-else-if="config.key === 'doublecolumn'" class="preview-doublecolumn">
                  <div class="first-column"></div>
                  <div class="second-column"></div>
                  <div class="content"></div>
                </div>
              </div>
            </div>

            <div class="layout-info">
              <h4 class="layout-name">{{ config.name }}</h4>
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
          <div class="theme-mode-card" :class="{ active: currentThemeMode === 'light' }"
            @click="handleThemeModeSwitch('light')">
            <div class="theme-mode-preview light-preview">
              <div class="preview-header"></div>
              <div class="preview-body"></div>
            </div>
            <div class="theme-mode-info">
              <h4 class="theme-mode-name">明亮模式</h4>
            </div>
            <div v-if="currentThemeMode === 'light'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>

          <div class="theme-mode-card" :class="{ active: currentThemeMode === 'dark' }"
            @click="handleThemeModeSwitch('dark')">
            <div class="theme-mode-preview dark-preview">
              <div class="preview-header"></div>
              <div class="preview-body"></div>
            </div>
            <div class="theme-mode-info">
              <h4 class="theme-mode-name">暗黑模式</h4>
            </div>
            <div v-if="currentThemeMode === 'dark'" class="active-badge">
              <CheckOutlined />
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边栏/顶栏主题切换 -->
      <div class="section">
        <h3 class="section-title">侧边栏/顶栏主题</h3>

        <div class="theme-switch-list">
          <div class="theme-switch-item">
            <div class="theme-switch-info">
              <h4 class="theme-switch-name">深色侧边栏</h4>
            </div>
            <a-switch :checked="currentSidebarTheme === 'dark'"
              @change="(checked) => handleSidebarThemeSwitch(checked ? 'dark' : 'light')" />
          </div>

          <div class="theme-switch-item">
            <div class="theme-switch-info">
              <h4 class="theme-switch-name">深色顶栏</h4>
            </div>
            <a-switch :checked="currentHeaderTheme === 'dark'"
              @change="(checked) => handleHeaderThemeSwitch(checked ? 'dark' : 'light')" />
          </div>
        </div>
      </div>

      <!-- 基础配置 -->
      <div class="section">
        <h3 class="section-title">基础配置</h3>

        <div class="base-config-list">
          <div class="config-item">
            <div class="config-info">
              <h4 class="config-name">文字大小</h4>
            </div>
            <a-input-number v-model:value="currentFontSize" :min="14" :max="18" :step="1" @change="handleFontSizeChange"
              style="width: 80px;" />
          </div>

          <div class="config-item">
            <div class="config-info">
              <h4 class="config-name">圆角设置</h4>
            </div>
            <a-input-number v-model:value="currentBorderRadius" :min="1" :max="16" :step="1"
              @change="handleBorderRadiusChange" style="width: 80px;" />
          </div>

          <div class="config-item">
            <div class="config-info">
              <h4 class="config-name">页签</h4>
            </div>
            <a-switch v-model:checked="currentTabsShow" @change="handleTabsShowChange" />
          </div>

          <div class="config-item">
            <div class="config-info">
              <h4 class="config-name">线宽风格</h4>
            </div>
            <a-switch v-model:checked="currentWireframe" @change="handleWireframeChange" />
          </div>

          <div class="config-item">
            <div class="config-info">
              <h4 class="config-name">页签阴影</h4>
              <p class="config-desc">启用页签的阴影效果</p>
            </div>
            <a-switch v-model:checked="currentTabShadow" @change="handleTabShadowChange" />
          </div>
        </div>
      </div>

      <!-- 自定义系统主题色 -->
      <div class="setting-section">
        <div class="section-title">系统主题色</div>
        <div class="section-description">选择系统主题色，支持预设颜色和自定义颜色</div>

        <!-- 预设主题色 -->
        <div class="theme-colors">
          <div v-for="(preset, index) in themeStore.colorPresets" :key="index" class="color-item"
            :class="{ active: themeStore.selectedPresetIndex === index && themeStore.colorMode === 'preset' }"
            :style="{ backgroundColor: preset.color }" @click="handlePresetColorSelect(index)" :title="preset.name">
            <CheckOutlined v-if="themeStore.selectedPresetIndex === index && themeStore.colorMode === 'preset'"
              class="check-icon" />
          </div>

          <!-- 自定义颜色选择器 -->
          <div class="custom-color-container" @click="handleCustomColorClick">
            <div class="custom-color-label">自定义</div>
            <color-picker v-model:pureColor="customColor" @pureColorChange="handleCustomColorChange"
              :theme="appStore.themeMode === 'dark' ? 'black' : 'white'" />
            <CheckOutlined v-if="themeStore.colorMode === 'custom'" class="check-icon" />
          </div>
        </div>
      </div>

      <!-- 页面动效 -->
      <div class="setting-section">
        <div class="section-title">页面动效</div>
        <div class="section-description">选择好看有趣的页面动效</div>

        <div class="animation-options">
          <div v-for="animation in pageAnimations" :key="animation.value" class="animation-item"
            :class="{ active: appStore.currentPageAnimation === animation.value }"
            @click="handleAnimationChange(animation.value)">
            <div class="animation-content">
              <!-- <t-icon :name="animation.icon" class="animation-icon" /> -->
              <span class="animation-label">{{ animation.label }}</span>
            </div>
            <!-- <t-icon v-if="appStore.currentPageAnimation === animation.value" name="check" class="check-icon" /> -->
            <CheckOutlined v-if="appStore.currentPageAnimation === animation.value" class="check-icon" />
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { message } from '@/utils'
import { useAppStore, useThemeStore } from '@/stores'
import { PAGE_ANIMATION_CONFIG } from '@/utils'

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
const themeStore = useThemeStore()

// 自定义颜色响应式变量
const customColor = ref(themeStore.primaryColorHex)

// 基础配置响应式变量
const currentFontSize = ref(themeStore.baseConfig.fontSize)
const currentBorderRadius = ref(themeStore.baseConfig.borderRadius)
const currentWireframe = ref(themeStore.baseConfig.wireframe)
const currentTabShadow = ref(themeStore.baseConfig.tabShadow)
const currentTabsShow = ref(appStore.tabsShow)

// 当前布局
const currentLayout = computed(() => appStore.layout)

// 页面动画效果选项 - 使用统一配置
const pageAnimations = PAGE_ANIMATION_CONFIG.options

// 当前主题模式
const currentThemeMode = computed(() => appStore.themeMode || 'light')

// 当前侧边栏主题
const currentSidebarTheme = computed(() => appStore.sidebarTheme || 'light')

// 当前顶部主题
const currentHeaderTheme = computed(() => appStore.headerTheme || 'light')

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
  handleClose()
}

// 处理侧边栏主题切换
const handleSidebarThemeSwitch = (theme) => {
  appStore.setSidebarTheme(theme)
}

// 处理顶部主题切换
const handleHeaderThemeSwitch = (theme) => {
  appStore.setHeaderTheme(theme)
}

// 处理预设主题色选择
const handlePresetColorSelect = (index) => {
  themeStore.selectPresetColor(index)
}

// 处理自定义颜色点击
const handleCustomColorClick = () => {
  // 点击时设置为自定义模式
  if (themeStore.colorMode !== 'custom') {
    themeStore.setPrimaryColor(customColor.value, 'custom')
  }
}

// 处理自定义颜色变化
const handleCustomColorChange = (color) => {
  customColor.value = color
  themeStore.setCustomColor(color)
}

// 处理基础配置变化
const handleFontSizeChange = (value) => {
  if (value !== null && value !== undefined) {
    themeStore.setFontSize(value)
    currentFontSize.value = value
  }
}

const handleBorderRadiusChange = (value) => {
  if (value !== null && value !== undefined) {
    themeStore.setBorderRadius(value)
    currentBorderRadius.value = value
  }
}


// 处理页签显示切换
const handleTabsShowChange = (checked) => {
  appStore.setTabsShow(checked)
  currentTabsShow.value = checked
}

const handleWireframeChange = (checked) => {
  themeStore.setWireframe(checked)
  currentWireframe.value = checked
}

// 处理页签阴影效果切换
const handleTabShadowChange = (checked) => {
  themeStore.setTabShadow(checked)
  currentTabShadow.value = checked
}

// 处理动画效果切换
const handleAnimationChange = (animation) => {
  appStore.setPageAnimation(animation)
}

</script>

<style scoped lang="scss">
.settings-content {
  padding: 8px 0;
}

.section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 16px;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.section-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.layout-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #4096ff;
    box-shadow: 0 4px 12px rgba(64, 150, 255, 0.15);
    transform: translateY(-2px);
  }

  &.active {
    border-color: #4096ff;
    background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
    box-shadow: 0 4px 16px rgba(64, 150, 255, 0.2);

    .layout-name {
      color: #1890ff;
      font-weight: 600;
    }
  }
}

.layout-preview {
  margin-bottom: 12px;
}

.preview-container {
  width: 100%;
  height: 64px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
    pointer-events: none;
  }
}

/* 侧边栏布局预览 */
.preview-sidebar {
  display: flex;
  height: 100%;

  .sidebar {
    width: 22px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 8px;
      left: 6px;
      right: 6px;
      height: 2px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 1px;
    }
  }

  .content {
    flex: 1;
    background: #fff;
    margin: 6px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 1px;
      background: #f0f0f0;
    }
  }
}

/* 顶部导航布局预览 */
.preview-topbar {
  display: flex;
  flex-direction: column;
  height: 100%;

  .topbar {
    height: 14px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      width: 20px;
      height: 2px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 1px;
    }
  }

  .content {
    flex: 1;
    background: #fff;
    margin: 6px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 1px;
      background: #f0f0f0;
    }
  }
}

/* 混合布局预览 */
.preview-mixed {
  display: flex;
  flex-direction: column;
  height: 100%;

  .topbar {
    height: 12px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  }

  .main {
    display: flex;
    flex: 1;

    .sidebar {
      width: 18px;
      background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    }

    .content {
      flex: 1;
      background: #fff;
      margin: 4px;
      border-radius: 3px;
    }
  }
}

/* 极简布局预览 */
.preview-minimal .content.full {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  border-radius: 4px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 2px;
    background: #d9d9d9;
    border-radius: 1px;
  }
}

/* 卡片布局预览 */
.preview-card {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .card-container {
    width: 80%;
    height: 70%;

    .card {
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 6px;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 全屏布局预览 */
.preview-fullscreen {
  display: flex;
  height: 100%;
  background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
  position: relative;

  .fullscreen-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f0f2f5 0%, #ffffff 100%);
    border-radius: 4px;
    margin: 2px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30px;
      height: 2px;
      background: #d9d9d9;
      border-radius: 1px;
    }
  }

  .floating-actions-preview {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;

    .floating-btn-preview {
      width: 6px;
      height: 6px;
      background: #1890ff;
      border-radius: 50%;
      opacity: 0.8;

      &:nth-child(2) {
        background: #52c41a;
      }

      &:nth-child(3) {
        background: #faad14;
      }
    }
  }
}

/* 双列布局预览 */
.preview-doublecolumn {
  display: flex;
  height: 100%;

  .first-column {
    width: 12px;
    background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 3px;
      right: 3px;
      height: 1px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 0.5px;
    }
  }

  .second-column {
    width: 16px;
    background: linear-gradient(135deg, #13c2c2 0%, #08979c 100%);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 3px;
      right: 3px;
      height: 1px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 0.5px;
    }
  }

  .content {
    flex: 1;
    background: #fff;
    margin: 6px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 1px;
      background: #f0f0f0;
    }
  }
}

.layout-info {
  text-align: center;
}

.layout-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
  transition: all 0.2s ease;
}

.layout-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.active-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.3);
}

/* 主题模式切换样式 */
.theme-mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.theme-mode-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #4096ff;
    box-shadow: 0 4px 12px rgba(64, 150, 255, 0.15);
    transform: translateY(-2px);
  }

  &.active {
    border-color: #4096ff;
    background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
    box-shadow: 0 4px 16px rgba(64, 150, 255, 0.2);

    .theme-mode-name {
      color: #1890ff;
      font-weight: 600;
    }
  }
}

.theme-mode-preview {
  width: 100%;
  height: 64px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.light-preview {
  background: #ffffff;

  .preview-header {
    height: 20px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    border-bottom: 1px solid #e8e8e8;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      width: 16px;
      height: 2px;
      background: #bfbfbf;
      border-radius: 1px;
    }
  }

  .preview-body {
    flex: 1;
    background: #ffffff;
    margin: 6px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 1px;
      background: #f0f0f0;
    }
  }
}

.dark-preview {
  background: #1f1f1f;

  .preview-header {
    height: 20px;
    background: linear-gradient(135deg, #141414 0%, #0f0f0f 100%);
    border-bottom: 1px solid #303030;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      width: 16px;
      height: 2px;
      background: #595959;
      border-radius: 1px;
    }
  }

  .preview-body {
    flex: 1;
    background: #262626;
    margin: 6px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      right: 6px;
      height: 1px;
      background: #404040;
    }
  }
}

.theme-mode-info {
  text-align: center;
}

.theme-mode-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
  transition: all 0.2s ease;
}

.theme-mode-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.4;
}

/* 主题切换列表样式 */
.theme-switch-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.theme-switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(24, 144, 255, 0.02);
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 8px;
  }
}

.theme-switch-info {
  flex: 1;
}

.theme-switch-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.theme-switch-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.4;
}

/* 基础配置列表样式 */
.base-config-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(24, 144, 255, 0.02);
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
    border-radius: 8px;
  }
}

.config-info {
  flex: 1;
}

.config-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 4px 0;
}

.config-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.4;
}

/* 主题色选择器样式 */
.setting-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 16px;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.section-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.theme-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.color-item {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px #1890ff, 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
}

.check-icon {
  color: #fff;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}

/* 自定义颜色选择器样式 */
.custom-color-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.custom-color-label {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
}

.custom-color-container:hover .custom-color-label {
  color: #1890ff;
}

/* 动画选项样式 */
.animation-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.animation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  position: relative;
  min-height: 60px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: #4096ff;
    background: #f0f9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 150, 255, 0.15);
  }

  &.active {
    border-color: #4096ff;
    background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
    box-shadow: 0 4px 16px rgba(64, 150, 255, 0.2);

    .animation-label {
      color: #1890ff;
      font-weight: 600;
    }
  }
}

.animation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.animation-icon {
  font-size: 18px;
  color: #8c8c8c;
  transition: all 0.2s ease;
}

.animation-item.active .animation-icon {
  color: #1890ff;
}

.animation-label {
  font-size: 12px;
  color: #262626;
  text-align: center;
  line-height: 1.2;
  transition: all 0.2s ease;
}

.animation-item .check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 12px;
  color: #1890ff;
  background: #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(24, 144, 255, 0.3);
}

/* 抽屉整体样式优化 */
:deep(.ant-drawer-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 24px;

  .ant-drawer-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
  }
}

:deep(.ant-drawer-body) {
  padding: 24px;
  background: #fafafa;
}

:deep(.ant-drawer-content) {
  border-radius: 0;
}

/* 开关组件样式优化 */
:deep(.ant-switch) {
  &.ant-switch-checked {
    background-color: #1890ff;
  }
}

/* 数字输入框样式优化 */
:deep(.ant-input-number) {
  border-radius: 6px;
  border-color: #d9d9d9;

  &:hover {
    border-color: #4096ff;
  }

  &:focus,
  &.ant-input-number-focused {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(64, 150, 255, 0.2);
  }
}
</style>