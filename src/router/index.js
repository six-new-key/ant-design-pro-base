/**
 * 路由器配置文件
 * 职责：创建路由器实例、配置路由守卫、管理路由跳转逻辑
 */

import { createRouter, createWebHistory } from 'vue-router'
import { noLayoutRoutes, layoutRoutes } from './routes'
import LayoutManager from '@/layouts/LayoutManager.vue'

// ==================== 路由器配置 ====================
/**
 * 创建路由器实例
 * 组合所有路由配置并设置历史模式
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 不使用布局管理器的路由（登录页等）
    ...noLayoutRoutes,
    
    // 使用布局管理器的路由（主应用页面）
    {
      path: '/',
      name: 'Layout',
      component: LayoutManager,
      children: layoutRoutes,
    }
  ]
})

// ==================== 路由守卫配置 ====================
// 路由守卫已在 permission.js 中自动配置

export default router