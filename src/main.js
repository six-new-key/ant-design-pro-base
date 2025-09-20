import { createApp } from 'vue'
import '@/style/index.scss'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import pinia from './stores'
import './permission' // 导入权限控制模块，自动配置路由守卫

const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
