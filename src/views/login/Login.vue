<template>
  <div class="login-container" :class="containerClass">
    <!-- 静态背景 -->
    <div v-if="loginStore.isStaticBackground" class="static-background"
      :style="{ backgroundImage: `url(${loginStore.currentBackgroundUrl})` }"></div>

    <!-- 动态背景容器 -->
    <div v-if="loginStore.isDynamicBackground" id="login-dynamic-bg" class="dynamic-background"></div>

    <!-- 功能控制区 -->
    <div class="control-panel">
      <!-- 背景模式切换 -->
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a-button type="text" size="large" :style="{ color: token.colorTextSecondary }">
          <template #icon>
            <bg-colors-outlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu @click="handleBackgroundModeChange">
            <a-sub-menu key="dynamic" title="动态背景">
              <a-menu-item v-for="bg in loginStore.dynamicBackgrounds" :key="`dynamic-${bg.id}`"
                @click="handleDynamicBgChange(bg.id)">
                <div class="bg-option">
                  <span>{{ bg.name }}</span>
                  <small class="bg-description">{{ bg.description }}</small>
                </div>
              </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="static" title="静态背景">
              <a-menu-item v-for="bg in loginStore.staticBackgrounds" :key="`static-${bg.id}`"
                @click="handleStaticBgChange(bg.id)">
                <div class="bg-option">
                  <div class="bg-preview" :style="{ backgroundImage: `url(${bg.preview})` }"></div>
                  <span>{{ bg.name }}</span>
                </div>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- 表单位置调整 -->
      <a-dropdown v-if="loginStore.isStaticBackground" placement="bottomRight" :trigger="['click']">
        <a-button type="text" size="large" :style="{ color: token.colorTextSecondary }">
          <template #icon>
            <layout-outlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu @click="handleFormPositionChange">
            <a-menu-item key="left">
              <template #icon>
                <align-left-outlined />
              </template>
              <span>左侧</span>
            </a-menu-item>
            <a-menu-item key="center">
              <template #icon>
                <align-center-outlined />
              </template>
              <span>居中</span>
            </a-menu-item>
            <a-menu-item key="right">
              <template #icon>
                <align-right-outlined />
              </template>
              <span>右侧</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- 主题模式切换 - 占位符 -->
      <a-button type="text" size="large" :style="{ color: token.colorTextSecondary }" @click="toggleTheme">
        <template #icon>
          <sun-outlined />
        </template>
      </a-button>

      <!-- 语言切换 - 占位符 -->
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a-button type="text" size="large" :style="{ color: token.colorTextSecondary }">
          <template #icon>
            <global-outlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu @click="handleLanguageChange">
            <a-menu-item key="zh-CN">
              <span>🇨🇳 中文</span>
            </a-menu-item>
            <a-menu-item key="en-US">
              <span>🇺🇸 English</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- 登录表单容器 -->
    <div :class="loginStore.formContainerClass">
      <div class="login-box">
        <div class="login-header">
          <img src="/vite.svg" alt="logo" class="logo" />
          <h1 class="title" :style="{ color: token.colorText }">
            Ant Design Pro
          </h1>
          <p class="subtitle" :style="{ color: token.colorTextSecondary }">
            欢迎登录后台管理系统
          </p>
        </div>

        <a-form :model="formData" :rules="rules" @finish="handleLogin" class="login-form">
          <a-form-item name="username">
            <a-input v-model:value="formData.username" size="large" placeholder="用户名">
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password">
            <a-input-password v-model:value="formData.password" size="large" placeholder="密码">
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-checkbox v-model:checked="formData.remember">
              记住我
            </a-checkbox>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" size="large" :loading="loading" class="login-button">
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="login-footer">
          <p :style="{ color: token.colorTextSecondary }">
            还没有账号？
            <a href="#" :style="{ color: token.colorPrimary }">
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { theme } from 'ant-design-vue'
import { message } from '@/utils'
import { settings } from '@/settings'
import { createDynamicBg, destroyDynamicBg, dynamicBgManager } from '@/utils'
import { useLoginStore } from '@/stores/modules/login'

// 使用 Ant Design Vue 的 design token
const { token } = theme.useToken()

// 使用登录状态管理
const loginStore = useLoginStore()

const router = useRouter()
const loading = ref(false)
let dynamicBgInstance = null

// 登录表单数据
const formData = reactive({
  username: 'admin',
  password: '123456',
  remember: false
})

// 表单验证规则
const rules = computed(() => ({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}))

// 容器样式类
const containerClass = computed(() => {
  const classes = []
  if (loginStore.isStaticBackground) {
    classes.push('static-mode')
  } else {
    classes.push('dynamic-mode')
  }
  return classes.join(' ')
})

// 处理登录
const handleLogin = async () => {
  loading.value = true

  try {
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 简单的登录验证
    if (formData.username === 'admin' && formData.password === '123456') {
      message.success('登录成功！')

      // 存储登录状态
      if (formData.remember) {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('username', formData.username)
      } else {
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('username', formData.username)
      }

      // 跳转到后台首页
      router.push('/dashboard')
    } else {
      message.error('用户名或密码错误！')
    }
  } catch (error) {
    message.error('登录失败，请重试！')
  } finally {
    loading.value = false
  }
}

// 处理背景模式切换
const handleBackgroundModeChange = ({ key }) => {
  // 这个函数现在主要用于处理菜单点击事件
  // 具体的背景切换由 handleDynamicBgChange 和 handleStaticBgChange 处理
}

// 处理动态背景切换
const handleDynamicBgChange = (bgId) => {
  loginStore.setBackgroundMode('dynamic')
  loginStore.setSelectedDynamicBg(bgId)
  destroyDynamicBackground()
  initDynamicBackground()
}

// 处理静态背景切换
const handleStaticBgChange = (bgId) => {
  loginStore.setBackgroundMode('static')
  loginStore.setSelectedStaticBg(bgId)
  destroyDynamicBackground()
}

// 处理表单位置切换
const handleFormPositionChange = ({ key }) => {
  loginStore.setFormPosition(key)
}

// 主题切换 - 占位符
const toggleTheme = () => {
  console.log('主题切换功能待实现')
}

// 语言切换 - 占位符
const handleLanguageChange = ({ key }) => {
  console.log('语言切换功能待实现', key)
}

// 初始化动态背景
const initDynamicBackground = () => {
  destroyDynamicBackground()
  if (loginStore.isDynamicBackground) {
    // 使用默认颜色
    const defaultColors = ["#9FCFFF","#6BA3FA","#3667F0","#284CE0","#9FCFFF","#6BA3FA"]
    
    // 使用管理器创建动态背景
    dynamicBgInstance = dynamicBgManager.create(
      'login-dynamic-bg',
      loginStore.selectedDynamicBg,
      {
        colors: defaultColors,
        loop: true
      }
    )
  }
}

// 切换动态背景类型
const switchDynamicBgType = (bgType) => {
  if (loginStore.isDynamicBackground && dynamicBgInstance) {
    const defaultColors = ["#9FCFFF","#6BA3FA","#3667F0","#284CE0","#9FCFFF","#6BA3FA"]
    dynamicBgInstance = dynamicBgManager.switchType(
      'login-dynamic-bg',
      bgType,
      {
        colors: defaultColors,
        loop: true
      }
    )
  }
}

//监听登录状态变化
watch(() => loginStore.backgroundMode, (newVal) => {
  if (newVal) {
    //刷新浏览器
    window.location.reload()
  }
})

// 监听动态背景类型变化
watch(() => loginStore.selectedDynamicBg, (newBgType) => {
  if (loginStore.isDynamicBackground) {
    switchDynamicBgType(newBgType)
  }
})

// 销毁动态背景
const destroyDynamicBackground = () => {
  if (dynamicBgInstance) {
    dynamicBgManager.destroy('login-dynamic-bg')
    dynamicBgInstance = null
  }
}

// 组件挂载时初始化
onMounted(() => {
  if (loginStore.isDynamicBackground) {
    initDynamicBackground()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  destroyDynamicBackground()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 静态背景 */
.static-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

/* 动态背景 */
.dynamic-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* 功能控制区 */
.control-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: v-bind('token.colorBgContainer');
  border-radius: v-bind('token.borderRadius + "px"');
  box-shadow: v-bind('token.boxShadow');
  backdrop-filter: blur(10px);
  border: 1px solid v-bind('token.colorBorder');
}

.control-panel .ant-btn {
  border: none;
  box-shadow: none;
}

.control-panel .ant-btn:hover {
  background: v-bind('token.colorBgTextHover');
}

/* 背景选项样式 */
.bg-option {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;
}

.bg-option span {
  font-weight: 500;
}

.bg-description {
  color: v-bind('token.colorTextSecondary');
  font-size: 12px;
  line-height: 1.2;
}

.bg-preview {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  border: 1px solid v-bind('token.colorBorder');
}

/* 登录表单容器 */
.login-form-container {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 20px;
  transition: all 0.3s ease;
}

/* 表单位置样式 */
.form-position-left {
  justify-content: flex-start;
  padding-left: 10%;
}

.form-position-center {
  justify-content: center;
}

.form-position-right {
  justify-content: flex-end;
  padding-right: 10%;
}

/* 登录框 */
.login-box {
  width: 100%;
  max-width: 400px;
  background: v-bind('token.colorBgContainer');
  border-radius: v-bind('token.borderRadiusLG + "px"');
  padding: 40px;
  backdrop-filter: blur(10px);
  border: 1px solid v-bind('token.colorBorder');
  box-shadow: v-bind('token.boxShadowSecondary');
  transition: all 0.3s ease;
}

.dark-theme .login-box {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.subtitle {
  font-size: 14px;
  margin: 0;
  transition: color 0.3s ease;
}

/* 登录表单 */
.login-form {
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

/* 登录底部 */
.login-footer {
  text-align: center;
  font-size: 14px;
}

.login-footer a {
  text-decoration: none;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    top: 10px;
    right: 10px;
    gap: 4px;
    padding: 4px;
  }

  .form-position-left {
    padding-left: 5%;
  }

  .form-position-right {
    padding-right: 5%;
  }

  .login-box {
    padding: 24px;
    margin: 0 16px;
  }

  .title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .control-panel {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px;
    justify-content: center;
  }

  .login-form-container {
    padding: 10px;
  }

  .form-position-left,
  .form-position-right {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }
}

/* 暗黑主题适配 */
.dark-theme {
  background: #0f0f0f;
}

.dark-theme .control-panel {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 动画效果 */
.login-box {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.control-panel {
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>