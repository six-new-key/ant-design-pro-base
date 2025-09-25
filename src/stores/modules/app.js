import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 页面切换动画效果选项
export const PAGE_ANIMATIONS = {
  // 滑动动效
  SLIDE_LEFT: 'slide-left',
  SLIDE_RIGHT: 'slide-right',
  SLIDE_UP: 'slide-up',
  SLIDE_DOWN: 'slide-down',

  // 淡入淡出动效
  FADE: 'fade',
  FADE_IN_UP: 'fadeInUp',
  FADE_IN_DOWN: 'fadeInDown',
  FADE_IN_LEFT: 'fadeInLeft',
  FADE_IN_RIGHT: 'fadeInRight',

  // 缩放动效
  ZOOM: 'zoom',
  ZOOM_IN_DOWN: 'zoomInDown',

  // 翻转动效
  FLIP: 'flip',

  // 弹跳动效
  BOUNCE: 'bounce',
  BOUNCE_IN_LEFT: 'bounceInLeft',
  BOUNCE_IN_RIGHT: 'bounceInRight',

  // 旋转动效
  ROTATE_IN_DOWN_LEFT: 'rotateInDownLeft',
  ROTATE_IN_DOWN_RIGHT: 'rotateInDownRight',
  ROTATE_IN_UP_LEFT: 'rotateInUpLeft',
  ROTATE_IN_UP_RIGHT: 'rotateInUpRight',

  // 光速动效
  LIGHT_SPEED_IN_LEFT: 'lightSpeedInLeft',
  LIGHT_SPEED_IN_RIGHT: 'lightSpeedInRight',

  // 摆动动效
  SWING: 'swing',
  JELLO: 'jello',

  // 心跳动效
  PULSE: 'pulse'
}

export const useAppStore = defineStore(
  "app",
  () => {
    // State
    const themeMode = ref("light"); // 主题模式：light/dark
    const sidebarTheme = ref("dark"); // 侧边栏：light/dark
    const headerTheme = ref("dark"); // 顶部主题：light/dark
    const language = ref("zh-CN");
    const layout = ref("sidebar"); // 默认布局
    const sidebarCollapsed = ref(false);
    const sidebarFixed = ref(true); // 侧边栏是否固定
    const loading = ref(false);
    const currentTopMenu = ref(""); // 当前选中的顶部菜单
    const tabsShow = ref(true); // 页签是否显示
    const shouldRefresh = ref(false) // 页面刷新标志
    //默认页面切换动画
    const currentPageAnimation = ref(PAGE_ANIMATIONS.BOUNCE_IN_LEFT)

    // Getters
    const isLoading = computed(() => loading.value);
    const currentLayout = computed(() => layout.value);

    // Actions
    const setThemeMode = (newThemeMode) => {
      themeMode.value = newThemeMode;
    };

    const setSidebarTheme = (newSidebarTheme) => {
      sidebarTheme.value = newSidebarTheme;
    };

    const setHeaderTheme = (newHeaderTheme) => {
      headerTheme.value = newHeaderTheme;
    };

    const setSidebarFixed = (newFixed) => {
      sidebarFixed.value = newFixed;
    };

    const setLanguage = (newLanguage) => {
      language.value = newLanguage;
    };

    const setLayout = (newLayout) => {
      layout.value = newLayout;
    };

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const setSidebarCollapsed = (collapsed) => {
      sidebarCollapsed.value = collapsed;
    };

    const setLoading = (isLoading) => {
      loading.value = isLoading;
    };

    const setCurrentTopMenu = (menuKey) => {
      currentTopMenu.value = menuKey;
    };

    const setTabsShow = (show) => {
      tabsShow.value = show;
    };

    // 刷新相关方法
    const triggerRefresh = () => {
      shouldRefresh.value = true
    }

    const resetRefresh = () => {
      shouldRefresh.value = false
    }

    // 设置页面切换动画
    const setPageAnimation = (animation) => {
      currentPageAnimation.value = animation
    }

    return {
      // State
      themeMode,
      sidebarTheme,
      headerTheme,
      language,
      layout,
      sidebarCollapsed,
      sidebarFixed,
      loading,
      currentTopMenu,
      tabsShow,
      shouldRefresh,

      // Getters
      isLoading,
      currentLayout,
      currentPageAnimation,


      // Actions
      setThemeMode,
      setSidebarTheme,
      setHeaderTheme,
      setLanguage,
      setLayout,
      toggleSidebar,
      setSidebarCollapsed,
      setTabsShow,
      setLoading,
      setCurrentTopMenu,
      setSidebarFixed,
      triggerRefresh,
      resetRefresh,
      setPageAnimation,

    };
  },
  {
    persist: {
      storage: localStorage,
      paths: [
        "themeMode",
        "sidebarTheme",
        "headerTheme",
        "language",
        "layout",
        "sidebarCollapsed",
        "sidebarFixed",
        "tabsShow",
        "currentTopMenu",
        'currentPageAnimation'
      ],
    },
  }
);

