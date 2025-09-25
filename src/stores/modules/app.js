import { defineStore } from "pinia";
import { ref, computed } from "vue";

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
      resetRefresh
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
      ],
    },
  }
);
