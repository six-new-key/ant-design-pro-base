<template>
  <div class="tabs-view">
    <div class="tabs-container">
      <!-- 左滚动按钮 -->
      <div class="scroll-button scroll-left" v-show="showScrollButtons && canScrollLeft" @click="scrollLeft">
        <a-button type="text">
          <LeftOutlined style="font-size: 12px;" />
        </a-button>
      </div>

      <!-- 页签滚动区域 -->
      <div class="tabs-scroll-area" ref="tabsScrollArea" @wheel="handleWheel">
        <div class="tabs-list" ref="tabsList">
          <div v-for="tab in tabsStore.activeTabs" :key="tab.path" :class="[
            'tab-item',
            {
              'active': tab.path === tabsStore.activeTabPath,
              'pinned': tab.pinned
            }
          ]" @click="handleTabClick(tab)" @mouseenter="hoveredTabPath = tab.path" @mouseleave="hoveredTabPath = null">

            <!-- 页签内容 -->
            <div class="tab-content">
              <!-- 页签图标 -->
              <div class="tab-favicon">
                <component v-if="tab.icon" :is="tab.icon" />
              </div>

              <!-- 页签标题 -->
              <span class="tab-title">{{ tab.title }}</span>

              <!-- 固定图标 -->
              <PushpinOutlined :rotate="-45" v-if="tab.pinned" class="tab-pin-icon" />

              <!-- 关闭按钮 -->
              <Transition name="tab-close-fade" mode="out-in">
                <div
                  v-if="tab.closable && !tab.pinned"
                  class="tab-close" @click.stop="handleTabClose(tab.path)">
                  <CloseCircleOutlined />
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </div>

      <!-- 右滚动按钮 -->
      <div class="scroll-button scroll-right" v-show="showScrollButtons && canScrollRight" @click="scrollRight">
        <a-button type="text">
          <RightOutlined style="font-size: 12px;" />
        </a-button>
      </div>

      <!-- 右侧下拉菜单 -->
      <div class="tabs-actions">
        <a-dropdown :trigger="['hover']" arrow>
          <a-button type="text">
            <DownOutlined style="font-size: 12px;" />
          </a-button>

          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="refresh">
                <template #icon>
                  <ReloadOutlined />
                </template>
                刷新
              </a-menu-item>

              <a-menu-item key="togglePin" :disabled="tabsStore.activeTab?.path === '/dashboard'">
                <template #icon>
                  <PushpinOutlined :rotate="-45" v-if="!tabsStore.activeTab?.pinned" />
                  <PushpinFilled :rotate="-45" v-else />
                </template>
                {{ tabsStore.activeTab?.pinned ? '取消固定' : '固定' }}
              </a-menu-item>

              <a-menu-divider />

              <a-menu-item key="closeLeft" :disabled="menuDisabledStates.closeLeft">
                <template #icon>
                  <VerticalRightOutlined />
                </template>
                关闭左侧
              </a-menu-item>

              <a-menu-item key="closeRight" :disabled="menuDisabledStates.closeRight">
                <template #icon>
                  <VerticalLeftOutlined />
                </template>
                关闭右侧
              </a-menu-item>

              <a-menu-item key="closeOthers" :disabled="menuDisabledStates.closeOthers">
                <template #icon>
                  <VerticalAlignMiddleOutlined />
                </template>
                关闭其他
              </a-menu-item>

              <a-menu-item key="closeAll" :disabled="menuDisabledStates.closeAll">
                <template #icon>
                  <SwapOutlined />
                </template>
                关闭全部
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTabsStore, useAppStore, useThemeStore } from '@/stores'
import {
  CloseCircleOutlined,
  SwapOutlined,
  DownOutlined,
  ReloadOutlined,
  PushpinOutlined,
  PushpinFilled,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  VerticalAlignMiddleOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const appStore = useAppStore()
const themeStore = useThemeStore()
const { token } = theme.useToken()

// 模板引用
const tabsScrollArea = ref(null)
const tabsList = ref(null)

// 悬停状态管理
const hoveredTabPath = ref(null)

// 滚动按钮状态
const showScrollButtons = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// 检查滚动状态
const checkScrollState = () => {
  if (!tabsScrollArea.value || !tabsList.value) return

  const scrollArea = tabsScrollArea.value
  const scrollWidth = scrollArea.scrollWidth
  const clientWidth = scrollArea.clientWidth
  const scrollLeft = scrollArea.scrollLeft

  // 判断是否需要显示滚动按钮
  showScrollButtons.value = scrollWidth > clientWidth

  // 判断左右滚动按钮的可用状态
  // 添加1像素的容差值来处理浮点数精度问题
  canScrollLeft.value = scrollLeft > 1
  canScrollRight.value = scrollLeft < (scrollWidth - clientWidth - 1)
}

// 初始化
onMounted(() => {
  tabsStore.initTabs()
  // 添加当前路由为页签
  if (route.path) {
    tabsStore.addTab(route)
  }

  // 初始化滚动状态检查
  nextTick(() => {
    checkScrollState()
    // 监听滚动区域的滚动事件
    if (tabsScrollArea.value) {
      tabsScrollArea.value.addEventListener('scroll', checkScrollState)
    }
  })
})

// 监听路由变化
watch(() => route.path, (newPath) => {
  if (newPath) {
    tabsStore.addTab(route)
    // 路由变化时也需要滚动到激活页签
    nextTick(() => {
      scrollToActiveTab()
      checkScrollState()
    })
  }
}, { immediate: true })

// 监听页签变化，更新滚动状态
watch(() => tabsStore.activeTabs.length, () => {
  nextTick(() => {
    checkScrollState()
  })
})

// 计算下拉菜单项的禁用状态
const menuDisabledStates = computed(() => {
  const currentIndex = tabsStore.activeTabIndex
  const currentTab = tabsStore.activeTab

  // 检查左侧是否有可关闭的页签
  const hasClosableLeftTabs = tabsStore.activeTabs
    .slice(0, currentIndex)
    .some(tab => tab.closable && !tab.pinned)

  // 检查右侧是否有可关闭的页签
  const hasClosableRightTabs = tabsStore.activeTabs
    .slice(currentIndex + 1)
    .some(tab => tab.closable && !tab.pinned)

  // 检查是否有其他可关闭的页签
  const hasOtherClosableTabs = tabsStore.activeTabs
    .filter(tab => tab.path !== currentTab?.path)
    .some(tab => tab.closable && !tab.pinned)

  // 检查是否有任何可关闭的页签
  const hasAnyClosableTabs = tabsStore.activeTabs
    .some(tab => tab.closable && !tab.pinned)

  return {
    closeLeft: !hasClosableLeftTabs,
    closeRight: !hasClosableRightTabs,
    closeOthers: !hasOtherClosableTabs,
    closeAll: !hasAnyClosableTabs
  }
})

// 页签点击事件
const handleTabClick = (tab) => {
  tabsStore.setActiveTab(tab.path)
  router.push(tab.path)
  // 滚动到激活的页签
  nextTick(() => {
    scrollToActiveTab()
  })
}

// 滚动到激活的页签 - 优化Chrome风格
const scrollToActiveTab = () => {
  if (!tabsScrollArea.value || !tabsList.value) return

  const activeTabElement = tabsList.value.querySelector('.tab-item.active')
  if (!activeTabElement) return

  const scrollContainer = tabsScrollArea.value
  const containerWidth = scrollContainer.clientWidth
  const tabLeft = activeTabElement.offsetLeft
  const tabWidth = activeTabElement.offsetWidth

  // 计算目标滚动位置，让激活的页签显示在容器中间
  const targetScrollLeft = tabLeft - (containerWidth - tabWidth) / 2

  // 平滑滚动到目标位置
  scrollContainer.scrollTo({
    left: Math.max(0, targetScrollLeft),
    behavior: 'smooth'
  })
}

// 左滚动按钮点击事件 - 优化滚动距离
const scrollLeft = () => {
  if (!tabsScrollArea.value) return

  const scrollAmount = 200 // 减少滚动距离，更精确
  const currentScrollLeft = tabsScrollArea.value.scrollLeft

  tabsScrollArea.value.scrollTo({
    left: Math.max(0, currentScrollLeft - scrollAmount),
    behavior: 'smooth'
  })

  // 滚动完成后检查状态
  setTimeout(() => {
    checkScrollState()
  }, 300)
}

// 右滚动按钮点击事件 - 优化滚动距离
const scrollRight = () => {
  if (!tabsScrollArea.value) return

  const scrollAmount = 200 // 减少滚动距离，更精确
  const currentScrollLeft = tabsScrollArea.value.scrollLeft
  const maxScrollLeft = tabsScrollArea.value.scrollWidth - tabsScrollArea.value.clientWidth

  tabsScrollArea.value.scrollTo({
    left: Math.min(maxScrollLeft, currentScrollLeft + scrollAmount),
    behavior: 'smooth'
  })

  // 滚动完成后检查状态
  setTimeout(() => {
    checkScrollState()
  }, 300)
}

// 页签关闭事件 - 添加Chrome风格的关闭动画
const handleTabClose = (path) => {
  // 添加关闭动画效果
  const tabElement = tabsList.value?.querySelector(`[data-tab="${path}"]`)
  if (tabElement) {
    tabElement.style.animation = 'tabCloseAnimation 0.2s ease-out forwards'

    setTimeout(() => {
      tabsStore.removeTab(path)

      // 如果关闭的是当前页签，需要跳转到新的激活页签
      if (path === route.path && tabsStore.activeTabPath !== path) {
        router.push(tabsStore.activeTabPath)
      }

      // 关闭页签后滚动到新的激活页签
      nextTick(() => {
        scrollToActiveTab()
        checkScrollState()
      })
    }, 200)
  } else {
    // 如果没有找到元素，直接执行关闭逻辑
    tabsStore.removeTab(path)
    if (path === route.path && tabsStore.activeTabPath !== path) {
      router.push(tabsStore.activeTabPath)
    }
    nextTick(() => {
      scrollToActiveTab()
      checkScrollState()
    })
  }
}

// 下拉菜单点击事件
const handleMenuClick = ({ key }) => {
  const currentPath = tabsStore.activeTabPath

  switch (key) {
    case 'refresh':
      appStore.triggerRefresh()
      break

    case 'togglePin':
      tabsStore.toggleTabPin(currentPath)
      break

    case 'closeLeft':
      tabsStore.closeLeftTabs(currentPath)
      nextTick(() => {
        scrollToActiveTab()
      })
      break

    case 'closeRight':
      tabsStore.closeRightTabs(currentPath)
      nextTick(() => {
        scrollToActiveTab()
      })
      break

    case 'closeOthers':
      tabsStore.closeOtherTabs(currentPath)
      nextTick(() => {
        scrollToActiveTab()
      })
      break

    case 'closeAll':
      tabsStore.closeAllTabs()
      if (tabsStore.activeTabPath !== currentPath) {
        router.push(tabsStore.activeTabPath)
      }
      nextTick(() => {
        scrollToActiveTab()
      })
      break
  }
}

// 鼠标滚轮事件
const handleWheel = (e) => {
  e.preventDefault()
  tabsScrollArea.value.scrollLeft += e.deltaY
  // 滚轮滚动后更新按钮状态
  nextTick(() => {
    checkScrollState()
  })
}
</script>

<style scoped lang="scss">
.tabs-view {
  border-top: 1px solid v-bind('token.colorFillSecondary');
  border-bottom: 1px solid v-bind('token.colorFillSecondary');
  position: relative;
  background: v-bind('token.colorBgContainer');
  //页签阴影效果
  box-shadow: v-bind('themeStore.baseConfig.tabShadow ? "0 2px 4px rgba(0, 0, 0, 0.08)" : "none"');

  .tabs-container {
    height: 100%;
    display: flex;
    align-items: flex-end;
    position: relative;
    padding: 0 12px;
    background: v-bind('token.colorBgContainer');

    .scroll-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: v-bind('themeStore.baseConfig.borderRadius + "px"');
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;

      &.scroll-left {
        opacity: 0.5;
        left: 0;
        border-right: 1px solid v-bind('token.colorFillSecondary');
      }

      &.scroll-right {
        opacity: 0.5;
        right: v-bind('(showScrollButtons === true && canScrollRight === true) ? "48px" : "0"');
      }
    }

    .tabs-scroll-area {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      cursor: default;
      height: 100%;
      padding: 8px 0 0;
      margin-left: v-bind('(showScrollButtons === true && canScrollLeft === true) ? "48px" : "0"');
      margin-right: v-bind('(showScrollButtons === true && canScrollRight === true) ? "48px" : "0"');

      &:active {
        cursor: grabbing;
      }

      // 隐藏滚动条但保持滚动功能
      &::-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none;
      scrollbar-width: none;

      .tabs-list {
          display: flex;
          align-items: flex-end;
          height: 100%;
          white-space: nowrap;
          min-width: max-content;
          gap: 2px;
        }

      .tab-item {
        position: relative;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        height: 36px;
        display: flex;
        align-items: center;
        background: v-bind('token.colorBgContainer');
        color: v-bind('token.colorTextSecondary');
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
        // margin-top: 4px;

        // Chrome页签弧形实现 - 只在激活时显示
        &::before,
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 12px;
          height: 12px;
          background: transparent;
          z-index: 2;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }

        &::before {
          left: -12px;
          border-bottom-right-radius: 12px;
        }

        &::after {
          right: -12px;
          border-bottom-left-radius: 12px;
        }

        .tab-content {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 0 16px;
          position: relative;
          z-index: 3;
        }

        .tab-favicon {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          background: v-bind('token.colorPrimary');
          opacity: 0.9;
          flex-shrink: 0;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: white;
        }

        .tab-title {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.2s ease;
          font-size: 13.5px;
          font-weight: 500;
        }

        .tab-close {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          font-size: 12px;
          color: v-bind('token.colorTextSecondary');
          opacity: 0.7;

          &:hover {
            background: v-bind('appStore.themeMode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
            opacity: 1;
            transform: scale(1.1);
          }
        }

        .tab-pin-icon {
          font-size: 12px;
          margin-left: 4px;
          transition: all 0.2s;
        }

        // 悬停效果
        &:hover {
          background: v-bind('token.colorBgContainer');
          color: v-bind('token.colorText');

          .tab-favicon {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        // 激活状态 - Chrome风格
        &.active {
          background: v-bind('token.colorPrimary + "20"');
          color: v-bind('token.colorPrimary');
          z-index: 3;
          margin-top: 0;
          height: 40px;
          border-radius: 10px 10px 0 0;
          box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.08);
          transform: translateY(1px);

          &::before {
            opacity: 1;
            box-shadow: 6px 0 0 0 v-bind('token.colorPrimary + "20"');
          }

          &::after {
            opacity: 1;
            box-shadow: -6px 0 0 0 v-bind('token.colorPrimary + "20"');
          }

          .tab-favicon {
            opacity: 1;
            transform: scale(1.05);
          }

          .tab-title {
            font-weight: 600;
          }

          .tab-close {
            color: v-bind('token.colorPrimary');
          }
        }

        // 固定页签样式
        &.pinned {
          .tab-pin-icon {
            transition: all 0.2s;
          }

          &:hover {
            .tab-pin-icon {
              transform: scale(1.1);
            }
          }
        }
      }

      // 关闭按钮动画
      .tab-close-fade-enter-active,
      .tab-close-fade-leave-active {
        transition: all 0.2s ease;
      }

      .tab-close-fade-enter-from {
        opacity: 0;
        transform: scale(0.8);
      }

      .tab-close-fade-leave-to {
        opacity: 0;
        transform: scale(0.8);
      }

      .tab-close-fade-enter-to,
      .tab-close-fade-leave-from {
        opacity: 1;
        transform: scale(1);
      }
    }

    .tabs-actions {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .ant-btn {
      border-radius: 0;
      border-left: 1px solid v-bind('token.colorFillSecondary');
    }

    .ant-btn:hover {
      background: none;
    }
  }
}

// 动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Chrome风格页签关闭动画
@keyframes tabCloseAnimation {
  from {
    opacity: 1;
    transform: scale(1) translateX(0);
    max-width: 220px;
  }

  to {
    opacity: 0;
    transform: scale(0.8) translateX(20px);
    max-width: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>