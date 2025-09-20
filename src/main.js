import { createApp } from 'vue'
import '@/style/index.scss'
import App from './App.vue'
import router from './router'
//引入图标库
import * as antIcons from "@ant-design/icons-vue";
import 'ant-design-vue/dist/reset.css'
import pinia from './stores'
import './permission' // 导入权限控制模块，自动配置路由守卫
import Vue3ColorPicker from 'vue3-colorpicker' // 引入颜色选择器插件
import 'vue3-colorpicker/style.css'

const app = createApp(App)

//注册图标组件
Object.keys(antIcons).forEach((key) => {
  app.component(key, antIcons[key]);
});

app.use(router)
app.use(pinia)
app.use(Vue3ColorPicker)
app.mount('#app')
