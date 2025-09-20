import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generate } from '@ant-design/colors'

// 预设主题色（用户指定的7个颜色）
const COLOR_PRESETS = [
  { name: '拂晓蓝', color: 'rgb(93, 135, 255)' },
  { name: '薄暮紫', color: 'rgb(180, 141, 243)' },
  { name: '明青', color: 'rgb(29, 132, 255)' },
  { name: '极光绿', color: 'rgb(96, 192, 65)' },
  { name: '拂晓青', color: 'rgb(56, 192, 252)' },
  { name: '日暮橙', color: 'rgb(249, 144, 31)' },
  { name: '法式洋红', color: 'rgb(255, 128, 200)' }
]

// RGB转HEX
function rgbToHex(rgb) {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return rgb
  
  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const primaryColor = ref(COLOR_PRESETS[0].color) // 默认使用第一个预设色
  const colorPresets = ref(COLOR_PRESETS)
  const customColors = ref([])
  const colorMode = ref('preset') // 'preset' | 'custom'
  const selectedPresetIndex = ref(0)
  const colorPalette = ref([])

  // 计算属性
  const primaryColorHex = computed(() => {
    return rgbToHex(primaryColor.value)
  })
  
  const currentColorPalette = computed(() => {
    if (colorPalette.value.length === 0) {
      return generate(rgbToHex(primaryColor.value))
    }
    return colorPalette.value
  })
  
  const allAvailableColors = computed(() => {
    return [
      ...colorPresets.value.map(preset => preset.color),
      ...customColors.value
    ]
  })

  // 方法
  const setPrimaryColor = (color, mode = 'preset', presetIndex = -1) => {
    primaryColor.value = color
    colorMode.value = mode
    
    if (mode === 'preset' && presetIndex >= 0) {
      selectedPresetIndex.value = presetIndex
    }
    
    // 生成新的色板
    generateColorPalette()
  }
  
  const selectPresetColor = (index) => {
    if (index >= 0 && index < colorPresets.value.length) {
      const preset = colorPresets.value[index]
      setPrimaryColor(preset.color, 'preset', index)
    }
  }
  
  const setCustomColor = (color) => {
    // 添加到自定义颜色历史（避免重复）
    if (!customColors.value.includes(color)) {
      customColors.value.unshift(color)
      // 限制自定义颜色历史数量
      if (customColors.value.length > 10) {
        customColors.value = customColors.value.slice(0, 10)
      }
    }
    
    setPrimaryColor(color, 'custom')
  }
  
  const generateColorPalette = () => {
    try {
      const hexColor = rgbToHex(primaryColor.value)
      colorPalette.value = generate(hexColor)
    } catch (error) {
      console.error('生成颜色色板失败:', error)
      // 使用默认色板
      colorPalette.value = generate('#1890ff')
    }
  }
  
  const resetToDefault = () => {
    setPrimaryColor(COLOR_PRESETS[0].color, 'preset', 0)
  }
  
  const clearCustomColors = () => {
    customColors.value = []
  }

  return {
    // 状态
    primaryColor,
    colorPresets,
    customColors,
    colorMode,
    selectedPresetIndex,
    colorPalette,
    // 计算属性
    primaryColorHex,
    currentColorPalette,
    allAvailableColors,
    // 方法
    setPrimaryColor,
    selectPresetColor,
    setCustomColor,
    generateColorPalette,
    resetToDefault,
    clearCustomColors
  }
}, {
  // 持久化配置
  persist: {
    key: 'theme-store',
    storage: localStorage,
    paths: ['primaryColor', 'customColors', 'colorMode', 'selectedPresetIndex']
  }
})