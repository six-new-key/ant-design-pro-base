import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import loginBg1 from '@/assets/image/login-bg-1.png'
import loginBg2 from '@/assets/image/login-bg-2.png'
import loginBg3 from '@/assets/image/login-bg-3.png'
import { DYNAMIC_BG_TYPES } from '@/utils/buildGradientBg'

export const useLoginStore = defineStore('login', () => {
  // 状态定义
  const backgroundMode = ref('static') // 'dynamic' | 'static'
  const formPosition = ref('right') // 'left' | 'center' | 'right'
  const selectedStaticBg = ref('bg1') // 'bg1' | 'bg2' | 'bg3'
  const selectedDynamicBg = ref(DYNAMIC_BG_TYPES.AESTHETIC_FLUID) // 动态背景类型
  
  // 主题模式 - 占位符
  // const themeMode = ref('light') // 'light' | 'dark'
  
  // 语言设置 - 占位符
  // const language = ref('zh-cn') // 'zh-cn' | 'en-us'
  
  // 静态背景图片列表
  const staticBackgrounds = ref([
    {
      id: 'bg1',
      name: '渐变背景',
      url: loginBg1,
      preview: loginBg1
    },
    {
      id: 'bg2', 
      name: '科技背景',
      url: loginBg2,
      preview: loginBg2
    },
    {
      id: 'bg3',
      name: '自然背景', 
      url: loginBg3,
      preview: loginBg3
    }
  ])
  
  // 动态背景类型列表
  const dynamicBackgrounds = ref([
    {
      id: DYNAMIC_BG_TYPES.AESTHETIC_FLUID,
      name: '优美流动',
      description: '流体动画效果'
    },
    {
      id: DYNAMIC_BG_TYPES.BLUR_GRADIENT,
      name: '模糊渐变',
      description: '渐变模糊效果'
    },
    {
      id: DYNAMIC_BG_TYPES.AMBIENT_LIGHT,
      name: '背景光',
      description: '环境光效果'
    },
    {
      id: DYNAMIC_BG_TYPES.ABSTRACT_SHAPE,
      name: '抽象曲线',
      description: '抽象几何动画'
    },
    {
      id: DYNAMIC_BG_TYPES.BLUR_DOT,
      name: '模糊圆点',
      description: '圆点模糊效果'
    }
  ])
  
  // 计算属性：当前背景URL
  const currentBackgroundUrl = computed(() => {
    if (backgroundMode.value === 'static') {
      const bg = staticBackgrounds.value.find(bg => bg.id === selectedStaticBg.value)
      return bg ? bg.url : staticBackgrounds.value[0].url
    }
    return null
  })
  
  // 计算属性：是否为动态背景
  const isDynamicBackground = computed(() => backgroundMode.value === 'dynamic')
  
  // 计算属性：是否为静态背景
  const isStaticBackground = computed(() => backgroundMode.value === 'static')
  
  // 计算属性：表单容器样式类
  const formContainerClass = computed(() => {
    const classes = ['login-form-container']
    
    if (isStaticBackground.value) {
      classes.push(`form-position-${formPosition.value}`)
    } else {
      classes.push('form-position-center')
    }
    
    return classes.join(' ')
  })
  
  // Actions
  const setBackgroundMode = (mode) => {
    backgroundMode.value = mode
    // 如果切换到动态背景，强制表单居中
    if (mode === 'dynamic') {
      setFormPosition('center')
    }
  }
  
  const setFormPosition = (position) => {
    // 只有在静态背景模式下才允许调整表单位置
    if (isStaticBackground.value) {
      formPosition.value = position
    }
  }
  
  const setSelectedStaticBg = (bgId) => {
    selectedStaticBg.value = bgId
  }
  
  const setSelectedDynamicBg = (bgType) => {
    selectedDynamicBg.value = bgType
  }
  
  // 主题切换 - 占位符
  const setThemeMode = (mode) => {
    console.log('主题切换功能待实现', mode)
  }
  
  // 语言切换 - 占位符
  const setLanguage = (lang) => {
    console.log('语言切换功能待实现', lang)
  }
  
  // 重置所有设置为默认值
  const resetToDefaults = () => {
    backgroundMode.value = 'static'
    formPosition.value = 'right'
    selectedStaticBg.value = 'bg1'
    selectedDynamicBg.value = DYNAMIC_BG_TYPES.AESTHETIC_FLUID
    // themeMode.value = 'light'
    // language.value = 'zh-cn'
  }
  
  // 获取当前配置的摘要
  const getCurrentConfig = () => {
    return {
      backgroundMode: backgroundMode.value,
      formPosition: formPosition.value,
      selectedStaticBg: selectedStaticBg.value,
      selectedDynamicBg: selectedDynamicBg.value,
      currentBackgroundUrl: currentBackgroundUrl.value
      // themeMode: themeMode.value,
      // language: language.value,
    }
  }
  
  return {
    // State
    backgroundMode,
    formPosition,
    selectedStaticBg,
    selectedDynamicBg,
    staticBackgrounds,
    dynamicBackgrounds,
    
    // Computed
    currentBackgroundUrl,
    isDynamicBackground,
    isStaticBackground,
    formContainerClass,
    
    // Actions
    setBackgroundMode,
    setFormPosition,
    setSelectedStaticBg,
    setSelectedDynamicBg,
    setThemeMode, // 占位符
    setLanguage, // 占位符
    resetToDefaults,
    getCurrentConfig
  }
}, {
  persist: {
    storage: localStorage,
    paths: [
      'backgroundMode',
      'formPosition',
      'selectedStaticBg',
      'selectedDynamicBg'
      // 'themeMode',
      // 'language'
    ]
  }
})