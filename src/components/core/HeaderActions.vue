<template>
    <!-- 搜索框 -->
    <!-- <a-input-search placeholder="站内搜索" style="width: 200px; margin-right: 16px" @search="onSearch" /> -->

    <a-space :size="15">
        <!-- 刷新按钮 -->
        <a-tooltip title="刷新">
            <a-button type="text" :icon="h(SyncOutlined)" @click="handleRefresh" />
        </a-tooltip>

        <!-- 全屏按钮 -->
        <a-tooltip title="全屏">
            <a-button type="text" :icon="h(FullscreenOutlined)" @click="toggleFullscreen" />
        </a-tooltip>

        <!-- 主题切换按钮 -->
        <a-button type="text"
            @click="toggleThemeMode(appStore.themeMode === 'dark' ? 'light' : 'dark')">
            <template #icon>
                <svg-icon :name="appStore.themeMode === 'dark' ? 'sun' : 'moon'"
                    width="17px" height="17px"
                    :color="color" />
            </template>
        </a-button>

        <!-- 语言切换按钮 -->
        <a-dropdown arrow placement="bottomRight">
            <template #overlay>
                <a-menu @click="toggleLanguage">
                    <a-menu-item key="zh-CN">
                        简体中文
                    </a-menu-item>
                    <a-menu-item key="en-US">
                        English
                    </a-menu-item>
                </a-menu>
            </template>
            <a-button type="text" :icon="h(GlobalOutlined)" />
        </a-dropdown>

        <!-- 通知图标 -->
        <!-- <a-badge :count="5" style="margin: 0 16px">
        <a-tooltip title="通知">
          <bell-outlined class="header-icon" />
        </a-tooltip>
      </a-badge> -->

        <!-- 用户头像下拉菜单 -->
        <a-dropdown arrow placement="bottomRight">
            <div class="user-info">
                <a-avatar>
                    <template #icon><user-outlined /></template>
                </a-avatar>
            </div>
            <template #overlay>
                <a-menu @click="handleMenuClick">
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
        </a-dropdown>
    </a-space>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    FullscreenOutlined,
    SyncOutlined,
    GlobalOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAppStore } from '@/stores'

const router = useRouter()
const appStore = useAppStore()

// 搜索功能
const onSearch = (value) => {
    console.log('搜索:', value)
    message.info(`搜索: ${value}`)
}

//颜色复杂计算
const color = computed(() => {
    if(appStore.themeMode === 'dark' || (appStore.layout === 'topbar' || appStore.layout === 'mixed') && appStore.headerTheme === 'dark'){
        return '#fff'
    }else{
        return '#2c2c2c'
    }
})

// 刷新功能
const handleRefresh = () => {
    window.location.reload()
}

// 全屏功能
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// 主题切换
const toggleThemeMode = (themeMode) => {
    appStore.setThemeMode(themeMode)
}


// 语言切换
const toggleLanguage = () => {
    appStore.setLanguage(appStore.language === 'zh-CN' ? 'en-US' : 'zh-CN')
}

// 处理用户菜单点击
const handleMenuClick = ({ key }) => {
    switch (key) {
        case 'profile':
            router.push('/profile')
            break
        case 'settings':
            router.push('/settings')
            break
        case 'logout':
            // 这里应该调用登出逻辑
            message.success('退出登录成功')
            router.push('/login')
            break
    }
}
</script>

<style scoped>
.user-info {
    cursor: pointer;
}

.ant-btn:hover{
    background: v-bind('appStore.headerTheme === "dark" && (appStore.layout === 'topbar' || appStore.layout === 'mixed') ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"');
}

.anticon {
    color: v-bind('appStore.headerTheme === "dark" && (appStore.layout === 'topbar' || appStore.layout === 'mixed') ? "#fff" : ""');
}
</style>