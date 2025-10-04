import router from '@/router'
import { settings } from './settings'
import { NProgress, initNProgress } from '@/utils'
// import { useUserStore } from '@/stores'
import { AuthUtils } from "@/utils";

// 初始化NProgress配置
initNProgress()

/**
 * 全局前置守卫
 * 处理用户认证和路由权限控制
 */
router.beforeEach((to, from, next) => {
  // 启动NProgress进度条
  NProgress.start()
  
  if(AuthUtils.getToken()){
    next()
  } else {
    if(to.path === '/login'){
      next()
    } else {
      next('/login')
    }
  }
})

/**
 * 全局后置钩子
 * 处理页面标题等后置逻辑
 */
router.afterEach((to) => {
  // 完成NProgress进度条
  NProgress.done()
  
  // 设置页面标题
  document.title = to.meta?.title ? `${to.meta.title} - ${settings.projectName}` : settings.projectName
})