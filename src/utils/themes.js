/**
 * 有关主题切换、主题切换动画工具函数
 */

// 预设主题色（用户指定的7个颜色）
export const COLOR_PRESETS = [
  { name: '明青', color: 'rgb(29, 132, 255)' },
  { name: '拂晓蓝', color: 'rgb(93, 135, 255)' },
  { name: '薄暮紫', color: 'rgb(180, 141, 243)' },
  { name: '极光绿', color: 'rgb(96, 192, 65)' },
  { name: '拂晓青', color: 'rgb(56, 192, 252)' },
  { name: '日暮橙', color: 'rgb(249, 144, 31)' },
  { name: '法式洋红', color: 'rgb(255, 128, 200)' }
]

/**
 * RGB转HEX
 * @param {string} rgb - RGB颜色值，格式如 'rgb(255, 255, 255)'
 * @returns {string} HEX颜色值，格式如 '#ffffff'
 */
export function rgbToHex(rgb) {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return rgb
  
  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])
  
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * 主题切换动画
 * @param {Event} e - 鼠标点击事件
 * @param {Function} themeChangeCallback - 主题切换回调函数
 * @param {Object} options - 动画选项
 * @param {number} options.duration - 动画持续时间，默认400ms
 */
export function themeChangeWithAnimation(e, themeChangeCallback, options = {}) {
  const { duration = 400, themeMode } = options

  // 检查浏览器是否支持 View Transition API
  if (!document.startViewTransition) {
    // 如果不支持，直接执行主题切换
    themeChangeCallback()
    return
  }

  //主动设置一个html属性
  document.documentElement.setAttribute('theme-mode', themeMode)

  // 获取到 transition API 实例
  const transition = document.startViewTransition(() => {
    themeChangeCallback()
  })

  // 在 transition.ready 的 Promise 完成后，执行自定义动画
  transition.ready.then(() => {
    // 由于我们要从鼠标点击的位置开始做动画，所以我们需要先获取到鼠标的位置
    const { clientX, clientY } = e

    // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY)
    )
    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`
    ]
    const isDark = document.documentElement.getAttribute('theme-mode') === 'dark'
    
    // 自定义动画
    document.documentElement.animate(
      {
        // 如果要切换到暗色主题，我们在过渡的时候从半径 100% 的圆开始，到 0% 的圆结束
        clipPath: isDark ? clipPath.reverse() : clipPath
      },
      {
        duration,
        fill: 'both',
        // 如果要切换到暗色主题，我们应该裁剪 view-transition-old(root) 的内容
        pseudoElement: isDark
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)'
      }
    )
  })
}