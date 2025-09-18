/**
 * 权限管理模块
 * 职责：处理用户认证、路由权限控制和相关辅助函数
 */

import router from '@/router'

// ==================== 辅助函数 ====================
/**
 * 获取用户登录状态
 * @returns {boolean} 是否已登录
 */
export function getUserLoginStatus() {
  return !!(localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn'))
}

/**
 * 判断是否需要认证但用户未登录
 * @param {Object} to - 目标路由
 * @param {boolean} isLoggedIn - 是否已登录
 * @returns {boolean}
 */
export function requiresAuthentication(to, isLoggedIn) {
  return to.meta?.requiresAuth && !isLoggedIn
}

/**
 * 判断已登录用户是否在访问登录页
 * @param {Object} to - 目标路由
 * @param {boolean} isLoggedIn - 是否已登录
 * @returns {boolean}
 */
export function isLoggedInUserAccessingLogin(to, isLoggedIn) {
  return to.path === '/login' && isLoggedIn
}

// ==================== 路由守卫配置 ====================
/**
 * 全局前置守卫
 * 处理用户认证和路由权限控制
 */
router.beforeEach((to, from, next) => {
  // 获取用户登录状态
  const isLoggedIn = getUserLoginStatus()
  
  // 处理认证逻辑
  if (requiresAuthentication(to, isLoggedIn)) {
    // 未登录用户访问需要认证的路由，重定向到登录页
    next('/login')
  } else if (isLoggedInUserAccessingLogin(to, isLoggedIn)) {
    // 已登录用户访问登录页，重定向到仪表盘
    next('/dashboard')
  } else {
    // 正常访问
    next()
  }
})

/**
 * 全局后置钩子
 * 处理页面标题等后置逻辑
 */
router.afterEach((to) => {
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - 管理系统` : '管理系统'
})