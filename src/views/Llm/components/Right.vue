<template>
    <div class="right-wrapper">
        <!-- 重连提示 -->
        <div v-if="isReconnecting" class="reconnect-notice">
            <a-alert message="连接中断，正在重连..." type="warning" show-icon />
        </div>

        <!-- 对话内容区：可滚动 -->
        <div class="chat-content" ref="chatContentRef">
            <!-- 欢迎消息 -->
            <div class="welcome-message">
                <AXWelcome variant="borderless"
                    icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                    title="Hello, I'm Ant Design X"
                    description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~">
                    <template #extra>
                        <a-space>
                            <a-button @click="resetChat">
                                <template #icon>
                                    <ReloadOutlined />
                                </template>
                                重置对话
                            </a-button>
                        </a-space>
                    </template>
                </AXWelcome>
            </div>

            <!-- 对话消息 -->
            <div class="chat-messages">
                <div v-for="(msg, index) in messages" :key="index" class="message-item">
                    <AXBubble :typing="msg.placement === 'start' ? { step: 2, interval: 20 } : false"
                        :placement="msg.placement" :loading="msg.loading" :content="msg.content"
                        :avatar="getAvatarStyle(msg.placement)" :messageRender="renderMarkdown"
                        :variant="msg.placement === 'start' ? 'outlined' : 'filled'" shape="corner">
                        <template #footer="{ content }">
                            <a-space :size="token.paddingXXS">
                                <a-button type="text" size="small" :icon="h(SyncOutlined)"
                                    @click="handleRetry(index)" />
                                <a-button type="text" size="small" :icon="h(CopyOutlined)"
                                    @click="handleCopy(content)" />
                            </a-space>
                        </template>
                    </AXBubble>
                </div>
            </div>
        </div>

        <!-- 消息发送区：固定在底部 -->
        <div class="sender">
            <SenderMsg v-model:message="messageValue" :loading="loading" @submit="handleSubmit"
                @cancel="handleCancel" />
        </div>
    </div>
</template>

<script setup>
import { ref, h, onMounted, nextTick, onUnmounted } from 'vue'
import { UserOutlined, RobotOutlined, ReloadOutlined, SyncOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { message } from '@/utils';
import SenderMsg from './SenderMsg.vue'
import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css' // 深色主题（推荐）
import { theme, Typography } from 'ant-design-vue';

// 常量定义
const SSE_CONSTANTS = {
    END_FLAG: '[DONE]',
    ERROR_PREFIX: '[ERROR] ',
    MAX_RECONNECT_ATTEMPTS: 2
};

// 定义state
const messageValue = ref('')
const loading = ref(false)
const chatContentRef = ref(null)
const isReconnecting = ref(false)
const reconnectCount = ref(0)
const { token } = theme.useToken();

// Markdown渲染器
const md = markdownit({
    html: true,
    breaks: true,
    typographer: true,
    // 启用代码高亮
    highlight: function (str, lang) {
        // 如果指定了语言且 highlight.js 支持，则高亮该语言
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
            } catch (err) { }
        }
        // 未指定语言或不支持时，自动检测语言并高亮
        return `<pre class="hljs"><code>${hljs.highlightAuto(str).value}</code></pre>`
    }
})

// SSE相关变量
let eventSource = null
let currentAiMessageIndex = -1
let reconnectTimer = null
let hasReceivedData = false

// 初始化消息
const messages = ref([
    {
        placement: 'start',
        content: '你好，我是AI助手，有什么可以帮助你的吗？',
        loading: false
    },
    {
        placement: 'end',
        content: '你能做什么？',
        loading: false
    },
    {
        placement: 'start',
        content: '我可以回答问题、提供信息、帮助解决问题等。请随时向我提问！',
        loading: false
    }
])

// 头像样式
const getAvatarStyle = (placement) => {
    const baseStyle = {
        color: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    if (placement === 'end') {
        return {
            icon: h(UserOutlined),
            style: {
                ...baseStyle,
                backgroundColor: '#1890ff',
            }
        };
    } else {
        return {
            icon: h(RobotOutlined),
            style: {
                ...baseStyle,
                backgroundColor: '#52c41a',
            }
        };
    }
};

// 修改渲染函数，添加类名
const renderMarkdown = (content) => h(Typography, null, {
    default: () => h('div', { innerHTML: md.render(content) })
})

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (chatContentRef.value) {
            chatContentRef.value.scrollTo({
                top: chatContentRef.value.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
};

// 重置聊天
const resetChat = () => {
    messages.value = [
        {
            placement: 'start',
            content: '你好，我是AI助手，有什么可以帮助你的吗？',
            loading: false
        }
    ];
    message.info('对话已重置');
};

// 发送消息
const handleSubmit = async (value) => {
    if (!value) return;

    messageValue.value = ''

    // 添加用户消息
    messages.value.push({
        placement: 'end',
        content: value,
        loading: false
    });

    loading.value = true;

    // 添加AI消息占位
    currentAiMessageIndex = messages.value.length;
    messages.value.push({
        placement: 'start',
        content: '',
        loading: true
    });

    scrollToBottom();

    // 使用SSE连接
    connectSSE(value);
}

// 取消发送
const handleCancel = () => {
    closeSSEConnection();
    messageValue.value = ''
}

// 重试发送
const handleRetry = (index) => {
    if (index < 0 || index >= messages.value.length) return;

    const message = messages.value[index];
    if (message.placement !== 'end') return;

    handleSubmit(message.content);
};

// 复制文本
const handleCopy = (textToCopy) => {
    if (!textToCopy) return message.success('Text is empty');
    navigator.clipboard.writeText(textToCopy).then(() => {
        message.success('Text copied successfully');
    }).catch(err => {
        message.error('Failed to copy text');
    });
};

//=================== SSE事件处理函数 ===============
const handleSSEOpen = () => {
    hasReceivedData = false;
    isReconnecting.value = false;
    reconnectCount.value = 0;
};

const handleSSEMessage = (event) => {
    const processedData = event.data;

    // 检查结束标志
    if (processedData === SSE_CONSTANTS.END_FLAG) {
        closeSSEConnection();
        loading.value = false;
        return;
    }

    // 检查错误标志
    if (processedData.startsWith(SSE_CONSTANTS.ERROR_PREFIX)) {
        if (currentAiMessageIndex !== -1) {
            messages.value[currentAiMessageIndex].content = processedData.replace(SSE_CONSTANTS.ERROR_PREFIX, '');
            messages.value[currentAiMessageIndex].loading = false;
        }
        closeSSEConnection();
        return;
    }

    // 正常数据处理
    if (processedData) {
        hasReceivedData = true;
        if (currentAiMessageIndex !== -1) {
            messages.value[currentAiMessageIndex].content += processedData;
            messages.value[currentAiMessageIndex].loading = false;
            scrollToBottom();
        }
    }
};

const handleSSEError = (error) => {
    console.error('SSE连接错误:', error);

    // 如果已经收到过数据，可能是正常结束
    if (hasReceivedData) {
        console.log('连接正常结束');
        closeSSEConnection();
        loading.value = false;
        return;
    }

    // 尝试重连
    if (reconnectCount.value < SSE_CONSTANTS.MAX_RECONNECT_ATTEMPTS) {
        reconnectCount.value++;
        isReconnecting.value = true;

        console.log(`尝试重连 (${reconnectCount.value}/${SSE_CONSTANTS.MAX_RECONNECT_ATTEMPTS})`);

        reconnectTimer = setTimeout(() => {
            // 获取最后一条用户消息进行重连
            const lastUserMessage = messages.value
                .filter(msg => msg.placement === 'end')
                .pop()?.content;
            if (lastUserMessage) {
                connectSSE(lastUserMessage);
            }
        }, 2000);
        return;
    }

    // 重连失败，显示错误
    if (currentAiMessageIndex !== -1 && messages.value[currentAiMessageIndex].content === '') {
        messages.value[currentAiMessageIndex].content = '连接异常，请重试';
        messages.value[currentAiMessageIndex].loading = false;
    }

    closeSSEConnection();
    message.error('连接异常');
};

//=================== SSE连接管理 ===============
const connectSSE = (userMessage) => {
    // 先关闭已有的连接
    if (eventSource) {
        closeSSEConnection();
    }

    const encodedMsg = encodeURIComponent(userMessage);
    const url = `http://localhost:8201/llm/chat?msg=${encodedMsg}&_t=${Date.now()}`;

    try {
        eventSource = new EventSource(url);

        // 绑定事件处理函数
        eventSource.onopen = handleSSEOpen;
        eventSource.onmessage = handleSSEMessage;
        eventSource.onerror = handleSSEError;

    } catch (error) {
        console.error('创建SSE连接失败:', error);
        if (currentAiMessageIndex !== -1) {
            messages.value[currentAiMessageIndex].content = '创建连接失败: ' + error.message;
            messages.value[currentAiMessageIndex].loading = false;
        }
        loading.value = false;
        message.error('连接创建失败');
    }
};

// 关闭SSE连接
const closeSSEConnection = () => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (eventSource) {
        // 移除事件监听器
        eventSource.onerror = null;
        eventSource.onmessage = null;
        eventSource.onopen = null;

        eventSource.close();
        eventSource = null;
        console.log('SSE连接已关闭');
    }

    loading.value = false;
    isReconnecting.value = false;
};

// 页面加载完成后滚动到底部
onMounted(() => {
    scrollToBottom();
});

// 组件卸载时自动关闭连接
onUnmounted(() => {
    closeSSEConnection();
});
</script>

<style scoped lang="scss">
//隐藏滚动条
::-webkit-scrollbar {
    display: none;
}

.right-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 50px 0 50px;

    .reconnect-notice {
        margin-bottom: 16px;
    }

    .chat-content {
        flex: 1;
        overflow-y: auto;
        padding-bottom: 250px;

        .welcome-message {
            margin-bottom: 50px;
        }

        .chat-messages {
            .message-item {
                margin-bottom: 24px;
            }
        }
    }

    .sender {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        padding: 0 50px 20px 50px;
        background: v-bind('token.colorBgContainer');
    }
}
</style>