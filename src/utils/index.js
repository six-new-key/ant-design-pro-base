// 统一导出工具函数
export { default as message } from './message.js'
export { default as notification } from './notification.js'
export { default as layoutConfig } from './layout.config.js'

// 主题相关工具函数
export {
    themeChangeWithAnimation
} from './themes.js'

// 为了兼容性，也导出大写版本
export { default as Message } from './message.js'
export { default as Notification } from './notification.js'