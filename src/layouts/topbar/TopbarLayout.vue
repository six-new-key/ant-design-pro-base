<template>
  <a-layout style="min-height: 100vh">
    <!-- 顶部导航栏 -->
    <a-layout-header class="topbar-header">
      <div class="header-left">
        <!-- Logo -->
        <div class="logo">
          <img src="/vite.svg" alt="logo" class="logo-img" />
          <span class="logo-text">Ant Design Pro</span>
        </div>
        
        <!-- 顶部菜单 -->
        <TopbarMenu />
      </div>
      
      <div class="header-right">
        <!-- 头部操作区 -->
        <HeaderActions />
      </div>
    </a-layout-header>
    
    <!-- 主内容区域 -->
    <a-layout>
      <a-layout-content class="topbar-content">
        <router-view />
      </a-layout-content>
      
      <!-- 页脚 -->
      <a-layout-footer class="topbar-footer">
        Ant Design Pro ©2024 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import TopbarMenu from './components/TopbarMenu.vue'
import HeaderActions from './components/HeaderActions.vue'
</script>

<style scoped>
.topbar-header {
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  margin-right: 40px;
  min-width: 200px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
}

.topbar-content {
  margin-top: 64px;
  padding: 24px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px - 70px);
}

.topbar-footer {
  text-align: center;
  background: #f0f2f5;
  border-top: 1px solid #e8e8e8;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .logo {
    min-width: auto;
    margin-right: 16px;
  }
  
  .logo-text {
    display: none;
  }
  
  .topbar-content {
    padding: 16px;
  }
}
</style>