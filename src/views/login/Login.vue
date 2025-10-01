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
      <a-dropdown placement="bottomRight" :trigger="['hover']">
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
          <h1 class="welcome-title" :style="{ color: token.colorText }">
            欢迎回来 👋
          </h1>
          <p class="welcome-subtitle" :style="{ color: token.colorTextSecondary }">
            请输入您的账户信息以开始管理您的项目
          </p>
        </div>

        <a-form :model="formData" :rules="rules">
          <!-- 用户名输入框 -->
          <a-form-item name="username">
            <a-input v-model:value="formData.username" size="large" placeholder="vben">
            </a-input>
          </a-form-item>

          <!-- 密码输入框 -->
          <a-form-item name="password">
            <a-input-password v-model:value="formData.password" size="large" placeholder="......">
            </a-input-password>
          </a-form-item>

          <!-- 滑块验证 -->
          <a-form-item name="captcha">
            <drag-verify ref="dragVerify" :height="39.6" :width="368.4" :background="token.colorFillSecondary"
              :progressBarBg="token.colorSuccess + '90'" :handlerBg="token.colorBgContainer" :textSize="token.fontSize - 2 + 'px'" :textColor="token.colorText"
              :radius="token.borderRadius + 'px'" v-model:isPassing="isPassing" text="请按住滑块拖动" successText="验证通过">
            </drag-verify>
          </a-form-item>

          <!-- 记住账号和忘记密码 -->
          <a-form-item>
            <div class="options-row">
              <a-checkbox v-model:checked="formData.remember">
                记住账号
              </a-checkbox>
              <a-button type="link">
                忘记密码?
              </a-button>
            </div>
          </a-form-item>

          <!-- 登录按钮 -->
          <a-form-item>
            <a-button type="primary" @click="handleLogin" size="large" :loading="loading" block>
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <!-- 登录方式选择 -->
        <div class="login-tabs">
          <a-button type="text" class="tab-button">
            手机号登录
          </a-button>
          <a-button type="text" class="tab-button">
            扫码登录
          </a-button>
        </div>

        <!-- 其他登录方式 -->
        <div class="other-login">
          <a-divider>其他登录方式</a-divider>
          <div class="social-login">
            <a-button type="text" shape="circle">
              <template #icon>
                <WechatOutlined />
              </template>
            </a-button>
            <a-button type="text" shape="circle">
              <template #icon>
                <AlipayCircleOutlined />
              </template>
            </a-button>
            <a-button type="text" shape="circle">
              <template #icon>
                <QqOutlined />
              </template>
            </a-button>
            <a-button type="text" shape="circle">
              <template #icon>
                <github-outlined />
              </template>
            </a-button>
            <a-button type="text" shape="circle">
              <template #icon>
                <TaobaoCircleOutlined />
              </template>
            </a-button>
            <a-button type="text" shape="circle">
              <template #icon>
                <DingdingOutlined />
              </template>
            </a-button>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="login-footer">
          <span>还没有账号？</span>
          <a-button type="link">
            创建账号
          </a-button>
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
import { dynamicBgManager, generateThemeColors } from '@/utils'
import { useLoginStore, useThemeStore } from '@/stores'
import DragVerify from '@/components/custom/DragVerify.vue'

// 使用 Ant Design Vue 的 design token
const { token } = theme.useToken()

const isPassing = ref(false)

// 使用登录状态管理
const loginStore = useLoginStore()
// 使用主题状态管理
const themeStore = useThemeStore()

const router = useRouter()
const loading = ref(false)
let dynamicBgInstance = null

// 登录表单数据
const formData = reactive({
  userType: 'Super',
  username: 'admin',
  password: '123456',
  captcha: false, // 滑块验证状态
  remember: false
})

// 登录类型
const loginType = ref('account')

// 表单验证规则
const rules = computed(() => ({
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    {
      validator: (rule, value) => {
        if (!value) {
          return Promise.reject('请完成滑块验证')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
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
    // 根据当前主题色生成渐变色数组
    const primaryColor = themeStore.primaryColorHex
    const themeColors = generateThemeColors(primaryColor)

    console.log('Using theme colors for dynamic background:', themeColors)

    // 使用管理器创建动态背景
    dynamicBgInstance = dynamicBgManager.create(
      'login-dynamic-bg',
      loginStore.selectedDynamicBg,
      {
        colors: themeColors,
        loop: true
      }
    )
  }
}

// 切换动态背景类型
const switchDynamicBgType = (bgType) => {
  if (loginStore.isDynamicBackground && dynamicBgInstance) {
    // 根据当前主题色生成渐变色数组
    const primaryColor = themeStore.primaryColorHex
    const themeColors = generateThemeColors(primaryColor)

    dynamicBgInstance = dynamicBgManager.switchType(
      'login-dynamic-bg',
      bgType,
      {
        colors: themeColors,
        loop: true
      }
    )
  }
}

// 添加主题色更新函数
const updateDynamicBgColors = (newPrimaryColor) => {
  if (loginStore.isDynamicBackground && dynamicBgInstance) {
    const themeColors = generateThemeColors(newPrimaryColor)
    console.log('Updating dynamic background colors:', themeColors)

    // 使用新颜色重新创建背景
    dynamicBgInstance = dynamicBgManager.switchType(
      'login-dynamic-bg',
      loginStore.selectedDynamicBg,
      {
        colors: themeColors,
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

// 监听主题色变化，自动更新动态背景色彩
watch(() => themeStore.primaryColorHex, (newPrimaryColor) => {
  if (loginStore.isDynamicBackground && dynamicBgInstance) {
    console.log('Theme color changed, updating dynamic background:', newPrimaryColor)
    updateDynamicBgColors(newPrimaryColor)
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

<style lang="scss" scoped>
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
  height: 100vh;
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
  animation: fadeInDown 0.3s ease-out;

  .ant-btn {
    border: none;
    box-shadow: none;

    &:hover {
      background: v-bind('token.colorBgTextHover');
    }
  }
}

/* 背景选项样式 */
.bg-option {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;

  span {
    font-weight: 500;
  }
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
  user-select: none;
  width: 100%;
  max-width: 450px;
  // background: transparent;
  background: v-bind('token.colorBgContainer');
  backdrop-filter: blur(6px);
  //阴影
  box-shadow: 0 0 10px rgba(0, 0, 0,0.2);
  border-radius: v-bind('token.borderRadius + 30 + "px"');
  padding: 20px 40px;
  border: 1px solid v-bind('token.colorBorder');
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;

  :where(.ant-form-item) {
    margin-bottom: 18px;
  }

  /* 登录头部 */
  .login-header {
    text-align: left;
    margin-bottom: 26px;

    .welcome-title {
      font-size: v-bind('token.fontSize + 14 + "px"');
      font-weight: 600;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .welcome-subtitle {
      font-size: v-bind('token.fontSize + "px"');
      margin: 0;
      line-height: 1.4;
    }
  }

  /* 登录表单 */
  .options-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .ant-btn {
      padding: 0;
      margin: 0;
    }
  }

  .login-tabs {
    display: flex;
    justify-content: center;
    gap: 32px;

    .tab-button {
      border: 1px solid v-bind('token.colorBorder');
      width: 50%;
    }
  }

  .other-login {

    .ant-divider {
      opacity: 0.7;
      margin: 10px 0;
      font-size: v-bind('token.fontSize - 2 + "px"');
    }

    .social-login {
      display: flex;
      justify-content: center;
      // gap: 2px;
    }
  }

  .login-footer {
    text-align: center;
    margin-top: 10px;

    span {
      opacity: 0.8;
      font-size: v-bind('token.fontSize + "px"');
      color: v-bind('token.colorText');
    }

    .ant-btn {
      padding: 0;
      margin: 0;
    }
  }
}

/* 动画效果 */
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