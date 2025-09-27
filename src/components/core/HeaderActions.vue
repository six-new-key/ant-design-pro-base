<template>
    <a-space :size="15">
        <!-- 搜索框 -->
        <div class="header-actions">
            <!-- 搜索 -->
            <div class="action-item search-trigger" @click="openSearchDialog">
                <div class="search-box">
                    <SearchOutlined class="search-icon" />
                    <span class="search-text">搜索</span>
                    <span class="search-shortcut">Ctrl K</span>
                </div>
            </div>
        </div>

        <a-tooltip title="刷新">
            <a-button type="text" :icon="h(SyncOutlined)" @click="handleRefresh" />
        </a-tooltip>

        <!-- 全屏按钮 -->
        <a-tooltip title="全屏">
            <a-button type="text" @click="toggleFullscreen">
                <template #icon>
                    <FullscreenOutlined v-if="!isFullscreen" />
                    <FullscreenExitOutlined v-else />
                </template>
            </a-button>
        </a-tooltip>

        <!-- 主题切换按钮 -->
        <a-button type="text" @click="toggleThemeMode">
            <template #icon>
                <svg-icon :name="appStore.themeMode === 'dark' ? 'sun' : 'moon'" width="17px" height="17px"
                    :color="color" />
            </template>
        </a-button>

        <!-- 语言切换按钮 -->
        <a-dropdown arrow placement="bottomRight">
            <template #overlay>
                <a-menu @click="toggleLanguage">
                    <a-menu-item v-for="option in languageOptions" :key="option.key">
                        <template #icon>
                            <svg-icon :style="{opacity: appStore.language === option.key ? 1 : 0}" :color="dotColor" :name="option.icon" :width="iconSize" :height="iconSize" />
                        </template>
                        {{ option.label }}
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

    <!-- 搜索对话框组件 -->
    <SearchDialog v-model="searchDialogVisible" />
</template>

<script setup>
import { computed, h, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SyncOutlined,
    GlobalOutlined,
    SearchOutlined
} from '@ant-design/icons-vue'
import { getLanguageOptions } from '@/locale'
import { message, themeChangeWithAnimation } from '@/utils'
import { useAppStore,useThemeStore } from '@/stores'
import SearchDialog from './SearchDialog.vue'

const router = useRouter()
const appStore = useAppStore()
const themeStore = useThemeStore()
const isFullscreen = ref(false)
const languageOptions = getLanguageOptions()
const dotColor = computed(() => themeStore.primaryColorHex)
const iconSize = computed(() => {
    return themeStore.baseConfig.fontSize + 8 + 'px'
})

// 搜索功能
const searchDialogVisible = ref(false)

// 打开搜索对话框
const openSearchDialog = () => {
    searchDialogVisible.value = true
}

const onSearch = (value) => {
    message.info(`搜索: ${value}`)
}

//颜色复杂计算
const color = computed(() => {
    if (appStore.themeMode === 'dark' || (appStore.layout === 'topbar' || appStore.layout === 'mixed') && appStore.headerTheme === 'dark') {
        return '#fff'
    } else {
        return '#2c2c2c'
    }
})

const anticonColor = computed(() => {
    if (appStore.headerTheme === "dark" && (appStore.layout === 'topbar' || appStore.layout === 'mixed')) {
        return '#fff'
    } else {
        return ''
    }
})

// 刷新页面
const handleRefresh = () => {
    appStore.triggerRefresh()
}

// 主题切换
const toggleThemeMode = async (e) => {
    await themeChangeWithAnimation(e, () => {
        appStore.setThemeMode(appStore.themeMode === 'dark' ? 'light' : 'dark')
    }, {
        themeMode: appStore.themeMode === 'dark' ? 'light' : 'dark'
    })
}

// 语言切换
const toggleLanguage = ({ key }) => {
    appStore.setLanguage(key)
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

// 全屏切换
const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

// 生命周期
onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped lang="scss">
// 搜索框样式
.header-actions {
    display: flex;
    align-items: center;
    margin-right: 16px;
}

.action-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
}

.search-trigger {
    .search-box {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 6px;
        border: 1px solid transparent;
        transition: all 0.2s ease;
        min-width: 200px;

        &:hover {
            background: rgba(0, 0, 0, 0.06);
            border-color: rgba(0, 0, 0, 0.1);
        }

        .search-icon {
            color: rgba(0, 0, 0, 0.45);
            margin-right: 8px;
        }

        .search-text {
            flex: 1;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
        }

        .search-shortcut {
            color: rgba(0, 0, 0, 0.25);
            font-size: 12px;
            padding: 2px 6px;
            background: rgba(0, 0, 0, 0.06);
            border-radius: 3px;
            font-family: monospace;
        }
    }
}



.user-info {
    cursor: pointer;
}

.ant-btn:hover {
    background: v-bind('appStore.headerTheme === "dark" && (appStore.layout === ' topbar' || appStore.layout === ' mixed') ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"');
}

.anticon {
    color: v-bind('anticonColor');
}
</style>