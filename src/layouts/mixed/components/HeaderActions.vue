<template>
    <a-space :size="20">
        <!-- 通知图标 -->
        <a-badge :count="5" style="margin-right: 16px">
            <bell-outlined class="header-icon" />
        </a-badge>

        <!-- 用户头像下拉菜单 -->
        <a-dropdown>
            <template #overlay>
                <a-menu>
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
            <a-avatar class="user-avatar">
                <template #icon><user-outlined /></template>
            </a-avatar>
        </a-dropdown>
    </a-space>
</template>

<script setup></script>

<style lang="scss" scoped></style>
