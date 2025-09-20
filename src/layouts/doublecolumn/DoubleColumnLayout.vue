<template>
    <a-layout style="height: 100vh; width: 100%;">
        <!-- 第一列：主菜单栏 -->
        <a-layout-sider :width="firstColumnWidth" class="first-column-sider"
            :class="{ 'first-column-sider-light': appStore.themeMode === 'light' && appStore.sidebarTheme === 'dark' }"
            :theme="appStore.sidebarTheme">
            <!-- Logo区域 -->
            <div class="logo-container">
                <img src="/vite.svg" alt="logo" class="logo-img" />
            </div>

            <!-- 第一列菜单 -->
            <FirstColumnMenu @menu-select="handleFirstColumnSelect" />
        </a-layout-sider>

        <!-- 第二列：子菜单栏 -->
        <transition name="slide-fade">
            <a-layout-sider v-if="showSecondColumn" :width="secondColumnWidth" v-model:collapsed="collapsed" collapsible
                :collapsed-width="secondColumnWidthCollapsed" class="second-column-sider" :theme="appStore.sidebarTheme"
                @mouseenter="handleSidebarMouseEnter" @mouseleave="handleSidebarMouseLeave">
                <!-- 第二列菜单 -->
                <SecondColumnMenu :parent-route="selectedParentRoute" />

                <template #trigger>
                    <TriggerCollapsed @trigger-collapse="handleToggleCollapse" @pin-click="handlePinClick" />
                </template>
            </a-layout-sider>
        </transition>


        <!-- 主内容区域 -->
        <a-layout class="double-column-layout"
            :style="{ marginLeft: appStore.sidebarCollapsed ? totalSidebarWidthCollapsed + 'px' : totalSidebarWidth + 'px' }">
            <!-- 头部 -->
            <a-layout-header class="double-column-header">
                <Header />
            </a-layout-header>

            <!-- 内容区域 -->
            <a-layout-content class="double-column-content">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '@/stores'
import Header from './components/Header.vue'
import FirstColumnMenu from './components/FirstColumnMenu.vue'
import SecondColumnMenu from './components/SecondColumnMenu.vue'
import { theme } from 'ant-design-vue'
import { settings } from '@/settings'
import TriggerCollapsed from '@/components/core/TriggerCollapsed.vue'

const appStore = useAppStore()
const { token } = theme.useToken()
const collapsed = ref(appStore.sidebarCollapsed)

watch(() => appStore.sidebarCollapsed, (newValue) => {
    collapsed.value = newValue
})

// 切换折叠按钮点击事件
const handleToggleCollapse = () => {
    collapsed.value = !collapsed.value
    appStore.setSidebarCollapsed(collapsed.value)
}

// 固定按钮点击事件
const handlePinClick = () => {
    appStore.setSidebarFixed(!appStore.sidebarFixed)
}

// 鼠标进入侧边栏事件处理
const handleSidebarMouseEnter = () => {
    if (!appStore.sidebarFixed) {
        appStore.setSidebarCollapsed(false)
    }
}

// 鼠标离开侧边栏事件处理
const handleSidebarMouseLeave = () => {
    if (!appStore.sidebarFixed) {
        appStore.setSidebarCollapsed(true)
    }
}

// 列宽设置
const firstColumnWidth = ref(settings.firstColumnWidth)
const secondColumnWidth = ref(settings.secondColumnWidth)
const secondColumnWidthCollapsed = ref(settings.secondColumnWidthCollapsed)

// 当前选中的父级路由
const selectedParentRoute = ref(null)

// 是否显示第二列
const showSecondColumn = computed(() => {
    return selectedParentRoute.value && selectedParentRoute.value.children && selectedParentRoute.value.children.length > 0
})

// 总侧边栏宽度
const totalSidebarWidth = computed(() => {
    return firstColumnWidth.value + (showSecondColumn.value ? secondColumnWidth.value : 0)
})

// 总侧边栏宽度（折叠状态）
const totalSidebarWidthCollapsed = computed(() => {
    return firstColumnWidth.value + (showSecondColumn.value ? secondColumnWidthCollapsed.value : 0)
})

// 处理第一列菜单选择
const handleFirstColumnSelect = (route) => {
    selectedParentRoute.value = route
}
</script>

<style scoped lang="scss">
.first-column-sider {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    border-right: 1px solid v-bind('token.colorFillSecondary');

    &.first-column-sider-light {
        border-right: 1px solid #414141;
    }
}

.second-column-sider {
    position: fixed;
    left: $first-column-width;
    top: 0;
    bottom: 0;
    z-index: 1;
    border-right: 1px solid v-bind('token.colorFillSecondary');
}

/* 从左至右滑入动画 */
.slide-fade-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.1s ease-in;
}

.slide-fade-enter-from {
    transform: translateX(-20px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}

.double-column-layout {
    height: 100vh;
    width: 100%;
    transition: margin-left 0.3s ease-out;
}

.double-column-header {
    background: v-bind('token.colorBgContainer');
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $top-height;
}

.double-column-content {
    height: calc(100vh - $top-height);
    overflow-y: auto;
    width: 100%;
    padding: $content-padding;
}

.logo-container {
    height: $top-height;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-img {
        width: 32px;
        height: 32px;
    }
}
</style>