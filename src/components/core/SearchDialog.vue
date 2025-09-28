<template>
    <!-- 搜索对话框 -->
    <a-modal v-model:open="visible" :footer="null" :closable="false" :width="600" @cancel="handleClose">
        <!-- 搜索输入框 -->
        <a-input ref="searchInputRef" v-model:value="searchQuery" placeholder="搜索页面" :bordered="true"
            @input="handleSearchInput" @keydown="handleKeydown" size="large" class="search-input">
            <template #prefix>
                <SearchOutlined />
            </template>
            <template #suffix>
                <EnterOutlined />
            </template>
        </a-input>

        <!-- 搜索结果 -->
        <div class="search-results" v-if="searchResults.length > 0">
            <div v-for="(item, index) in searchResults" :key="item.path"
                :class="['search-result-item', { active: selectedIndex === index }]" @click="navigateToItem(item)"
                @mouseenter="selectedIndex = index">
                <div class="result-icon">
                    <component :is="item.icon" v-if="item.icon" />
                    <FileOutlined v-else />
                </div>
                <div class="result-content">
                    <div class="result-title" v-html="highlightText(item.title, searchQuery)"></div>
                    <div class="result-path">{{ item.path }}</div>
                </div>
                <div class="result-action">
                    <EnterOutlined />
                </div>
            </div>
        </div>

        <!-- 无结果提示 -->
        <div class="no-results" v-else-if="searchQuery.trim() && searchResults.length === 0">
            <div class="no-results-icon">
                <SearchOutlined />
            </div>
            <div class="no-results-text">未找到相关结果</div>
        </div>

        <!-- 底部操作提示 -->
        <div class="search-footer">
            <div class="search-tips">
                <span class="tip-item">
                    <kbd>↑</kbd><kbd>↓</kbd> 选择
                </span>
                <span class="tip-item">
                    <kbd>ESC</kbd> 关闭
                </span>
            </div>
        </div>
    </a-modal>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    SearchOutlined,
    FileOutlined,
    EnterOutlined
} from '@ant-design/icons-vue'
import { message } from '@/utils'
import { getAllMenuItems, searchMenuItems, highlightText } from '@/utils'
import { theme } from 'ant-design-vue'

// Props
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const { token } = theme.useToken()
// Emits
const emit = defineEmits(['update:modelValue'])

// Router
const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const searchResults = ref([])
const selectedIndex = ref(0)
const searchInputRef = ref(null)
const menuItems = ref([])

// 计算属性
const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// 初始化菜单数据
onMounted(() => {
    menuItems.value = getAllMenuItems()
})

// 监听对话框打开状态
watch(visible, (newValue) => {
    if (newValue) {
        nextTick(() => {
            searchInputRef.value?.focus()
        })
    } else {
        // 关闭时重置状态
        searchQuery.value = ''
        searchResults.value = []
        selectedIndex.value = 0
    }
})

// 关闭对话框
const handleClose = () => {
    visible.value = false
}

// 处理搜索输入
const handleSearchInput = () => {
    if (searchQuery.value.trim()) {
        searchResults.value = searchMenuItems(searchQuery.value, menuItems.value)
        selectedIndex.value = 0
    } else {
        searchResults.value = []
    }
}

// 处理键盘事件
const handleKeydown = (e) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
    } else if (e.key === 'Enter') {
        e.preventDefault()
        if (searchResults.value[selectedIndex.value]) {
            navigateToItem(searchResults.value[selectedIndex.value])
        }
    } else if (e.key === 'Escape') {
        handleClose()
    }
}

// 导航到选中项
const navigateToItem = (item) => {
    router.push(item.path)
    handleClose()
    message.success(`导航到: ${item.title}`)
}
</script>

<style scoped lang="scss">
.search-input {
    padding: 11px;
    background: v-bind('token.colorPrimary') !important;
}

.search-results {
    max-height: 400px;
    overflow-y: auto;
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f5f5f5;

    &:hover,
    &.active {
        background: v-bind('token.colorPrimary') !important;
    }

    &:last-child {
        border-bottom: none;
    }

    .result-icon {
        margin-right: 12px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        width: 20px;
        display: flex;
        justify-content: center;
    }

    .result-content {
        flex: 1;

        .result-title {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            margin-bottom: 2px;

            :deep(mark) {
                background: #bae0ff;
                color: #1890ff;
                padding: 0;
            }
        }

        .result-path {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
        }
    }

    .result-action {
        color: rgba(0, 0, 0, 0.25);
        font-size: 12px;
    }
}

.no-results {
    padding: 40px 20px;
    text-align: center;

    .no-results-icon {
        font-size: 48px;
        color: rgba(0, 0, 0, 0.25);
        margin-bottom: 16px;
    }

    .no-results-text {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
    }
}

.search-footer {
    margin-top: 40px;
    padding: 12px 20px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;

    .search-tips {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);

        .tip-item {
            display: flex;
            align-items: center;
            gap: 4px;

            kbd {
                padding: 2px 6px;
                background: #fff;
                border: 1px solid #d9d9d9;
                border-radius: 3px;
                font-size: 11px;
                font-family: monospace;
                color: rgba(0, 0, 0, 0.65);
            }
        }
    }
}
</style>