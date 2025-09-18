<template>
  <a-layout style="min-height: 100vh">
    <!-- 顶部导航栏 -->
    <MixedTopMenu />
    
    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        :width="224"
        class="mixed-sider"
      >
        <MixedSideMenu :collapsed="collapsed" />
      </a-layout-sider>
      
      <!-- 主内容区域 -->
      <a-layout>
        <a-layout-content class="mixed-content">
          <router-view />
        </a-layout-content>
        
        <a-layout-footer class="mixed-footer">
          Ant Design Pro ©2024 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAppStore } from '@/stores'
import MixedTopMenu from './components/MixedTopMenu.vue'
import MixedSideMenu from './components/MixedSideMenu.vue'

const appStore = useAppStore()
const collapsed = ref(appStore.sidebarCollapsed)

// 监听侧边栏状态变化
watch(() => collapsed.value, (newVal) => {
  appStore.setSidebarCollapsed(newVal)
})
</script>

<style scoped>
.mixed-sider {
  background: #001529;
}

.mixed-content {
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;
}

.mixed-footer {
  text-align: center;
  background: #f0f2f5;
}
</style>