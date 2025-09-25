<template>
    <!-- 刷新loading状态 -->
    <div v-if="isRefreshing" class="refresh-loading">
        <a-spin tip="刷新中..." />
    </div>
    <transition appear mode="out-in" v-else :enter-active-class="`animate__animated ${getEnterAnimation}`">
        <router-view :key="routerViewKey" />
    </transition>
</template>

<script setup>
import { ref, watch, nextTick,computed } from 'vue'
import { useAppStore,PAGE_ANIMATIONS } from '@/stores'

const appStore = useAppStore()

// 刷新状态管理
const isRefreshing = ref(false)
const routerViewKey = ref(0)


// 动画效果计算属性
const getEnterAnimation = computed(() => {
    switch (appStore.currentPageAnimation) {
        // 滑动动效
        case PAGE_ANIMATIONS.SLIDE_LEFT:
            return 'animate__backInLeft'
        case PAGE_ANIMATIONS.SLIDE_RIGHT:
            return 'animate__backInRight'
        case PAGE_ANIMATIONS.SLIDE_UP:
            return 'animate__backInUp'
        case PAGE_ANIMATIONS.SLIDE_DOWN:
            return 'animate__backInDown'

        // 淡入淡出动效
        case PAGE_ANIMATIONS.FADE:
            return 'animate__fadeIn'
        case PAGE_ANIMATIONS.FADE_IN_UP:
            return 'animate__fadeInUp'
        case PAGE_ANIMATIONS.FADE_IN_DOWN:
            return 'animate__fadeInDown'
        case PAGE_ANIMATIONS.FADE_IN_LEFT:
            return 'animate__fadeInLeft'
        case PAGE_ANIMATIONS.FADE_IN_RIGHT:
            return 'animate__fadeInRight'

        // 缩放动效
        case PAGE_ANIMATIONS.ZOOM:
            return 'animate__zoomIn'
        case PAGE_ANIMATIONS.ZOOM_IN_DOWN:
            return 'animate__zoomInDown'

        // 翻转动效
        case PAGE_ANIMATIONS.FLIP:
            return 'animate__flipInY'

        // 弹跳动效
        case PAGE_ANIMATIONS.BOUNCE:
            return 'animate__bounceIn'
        case PAGE_ANIMATIONS.BOUNCE_IN_LEFT:
            return 'animate__bounceInLeft'
        case PAGE_ANIMATIONS.BOUNCE_IN_RIGHT:
            return 'animate__bounceInRight'

        // 旋转动效
        case PAGE_ANIMATIONS.ROTATE_IN_DOWN_LEFT:
            return 'animate__rotateInDownLeft'
        case PAGE_ANIMATIONS.ROTATE_IN_DOWN_RIGHT:
            return 'animate__rotateInDownRight'
        case PAGE_ANIMATIONS.ROTATE_IN_UP_LEFT:
            return 'animate__rotateInUpLeft'
        case PAGE_ANIMATIONS.ROTATE_IN_UP_RIGHT:
            return 'animate__rotateInUpRight'

        // 光速动效
        case PAGE_ANIMATIONS.LIGHT_SPEED_IN_LEFT:
            return 'animate__lightSpeedInLeft'
        case PAGE_ANIMATIONS.LIGHT_SPEED_IN_RIGHT:
            return 'animate__lightSpeedInRight'

        // 摆动动效
        case PAGE_ANIMATIONS.SWING:
            return 'animate__swing'
        case PAGE_ANIMATIONS.JELLO:
            return 'animate__jello'

        // 心跳动效
        case PAGE_ANIMATIONS.PULSE:
            return 'animate__pulse'

        default:
            return 'animate__fadeIn'
    }
})

// 监听刷新状态
watch(
    () => appStore.shouldRefresh,
    (shouldRefresh) => {
        if (shouldRefresh) {
            // 执行页面刷新
            handlePageRefresh()
            // 重置刷新状态
            appStore.resetRefresh()
        }
    }
)

// 处理页面刷新
const handlePageRefresh = async () => {
    // 显示刷新加载状态
    isRefreshing.value = true

    // 等待一小段时间让用户看到刷新提示
    await new Promise(resolve => setTimeout(resolve, 300))

    // 更新router-view的key来强制重新渲染组件
    routerViewKey.value += 1

    // 等待DOM更新完成
    await nextTick()

    // 隐藏刷新加载状态
    isRefreshing.value = false
}
</script>

<style scoped lang="scss">
.refresh-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}
</style>