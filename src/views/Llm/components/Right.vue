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
                </AXWelcome>
            </div>

            <!-- 对话消息 -->
            <a-spin v-if="loadingMsg" class="spin-loading" :spinning="loadingMsg" tip="加载中..." />

            <div v-else class="chat-messages">
                <div v-for="(msg, index) in messages" :key="index" class="message-item">
                    <!-- 非思考模式 -->
                    <template v-if="!msg.thinkMode">
                        <AXBubble :placement="msg.placement" :loading="msg.loading"
                            :avatar="getAvatarStyle(msg.placement)"
                            :variant="msg.placement === 'start' ? 'borderless' : 'outlined'"
                            :content="msg.text.answerContent" :messageRender="renderMarkdown1" shape="corner">
                            <template #footer="{ content }">
                                <a-space :size="token.paddingXXS">
                                    <a-button type="text" size="small" :icon="h(SyncOutlined)"
                                        @click="handleRetry(index)" />
                                    <a-button type="text" size="small" :icon="h(CopyOutlined)"
                                        @click="handleCopy(content)" />
                                </a-space>
                            </template>
                        </AXBubble>
                    </template>

                    <!-- 思考模式 -->
                    <template v-else>
                        <!-- 大模型 -->
                        <template v-if="msg.placement === 'start'">
                            <AXBubble :placement="msg.placement" :loading="msg.loading"
                                :avatar="getAvatarStyle(msg.placement)" shape="corner">
                                <template #message>
                                    <a-space direction="vertical" :size="msg.collapse ? 5 : 10">
                                        <a-space @click="() => {
                                            msg.collapse = !msg.collapse;
                                        }" style="cursor: pointer;" :size="5" direction="horizontal">
                                            <span style="opacity: 0.7;">已深度思考</span>
                                            <UpOutlined :style="{ fontSize: '12px',opacity: 0.7 }"
                                                v-if="!msg.collapse" />
                                            <DownOutlined :style="{ fontSize: '12px',opacity: 0.7 }"
                                                v-else />
                                        </a-space>

                                        <AXBubble
                                            :style="{ borderLeft: `2px solid ${token.colorBorder}`, paddingLeft: '12px',opacity: 0.7 }"
                                            v-show="!msg.collapse && !msg.loading" variant="borderless"
                                            :content="msg.text.thinkContent" :message-render="renderMarkdown2" />
                                    </a-space>
                                </template>
                                <template #footer>
                                    <a-space direction="vertical">
                                        <AXBubble variant="borderless" :content="msg.text.answerContent"
                                            :message-render="renderMarkdown3" />

                                        <a-space :size="token.paddingXXS">
                                            <a-button type="text" size="small" :icon="h(SyncOutlined)"
                                                @click="handleRetry(index)" />
                                            <a-button type="text" size="small" :icon="h(CopyOutlined)"
                                                @click="handleCopy(msg.text.answerContent)" />
                                        </a-space>
                                    </a-space>
                                </template>
                            </AXBubble>
                        </template>
                        <!-- 用户 -->
                        <template v-else>
                            <AXBubble :placement="msg.placement" :avatar="getAvatarStyle(msg.placement)"
                                variant="outlined" :content="msg.text.answerContent" :messageRender="renderMarkdown1"
                                shape="corner">
                                <template #footer="{ content }">
                                    <a-space :size="token.paddingXXS">
                                        <a-button type="text" size="small" :icon="h(SyncOutlined)"
                                            @click="handleRetry(index)" />
                                        <a-button type="text" size="small" :icon="h(CopyOutlined)"
                                            @click="handleCopy(content)" />
                                    </a-space>
                                </template>
                            </AXBubble>
                        </template>
                    </template>
                </div>
            </div>
        </div>

        <!-- 消息发送区：固定在底部 -->
        <div class="sender">
            <AXSender :allow-speech="true" :actions="false" v-model:value="messageValue"
                :auto-size="{ minRows: 2, maxRows: 8 }" @submit="handleSubmit" @cancel="handleCancel">
                <template #footer="{ info: { components: { SendButton, LoadingButton, SpeechButton } } }">
                    <a-flex justify="space-between" align="center">
                        <a-flex gap="small" align="center">
                            <a-select v-model:value="selectedModel" style="width: 120px"
                                :options="modelList"></a-select>
                            <a-divider type="vertical" />
                            深度思考
                            <a-switch v-model:checked="enableThinking" />
                            <a-divider type="vertical" />
                            联网搜索
                            <a-switch v-model:checked="enableSearch" />
                        </a-flex>
                        <a-flex align="center">
                            <a-button :style="iconStyle" type="text" :icon="h(LinkOutlined)" />
                            <a-divider type="vertical" />
                            <!-- <component :is="SpeechButton" :style="iconStyle" />
                            <a-divider type="vertical" /> -->
                            <component :is="LoadingButton" v-if="submitLoading" type="default" />
                            <component :is="SendButton" v-else type="primary" :disabled="false" />
                        </a-flex>
                    </a-flex>
                </template>
            </AXSender>
        </div>
    </div>
</template>

<script setup>
import { ref, h, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { UserOutlined, RobotOutlined, CopyOutlined, SyncOutlined, LinkOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message, createConversationId } from '@/utils';
import markdownit from 'markdown-it'
import markdownitTaskLists from 'markdown-it-task-lists'
// import { full as emoji } from 'markdown-it-emoji'
import markdownitSub from 'markdown-it-sub'
import markdownitSup from 'markdown-it-sup'
import markdownitMark from 'markdown-it-mark'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import { useAppStore, useUserStore } from '@/stores'
import { theme, Typography } from 'ant-design-vue';
import { chatStream, queryAllModelList, queryMessages } from '@/api'

// 定义props
const props = defineProps({
    conversationId: {
        type: String,
        default: ''
    },
    createNewChat: {
        type: Boolean,
        default: false
    },
    newConversationId: {
        type: String,
        default: ''
    },
})

const emit = defineEmits(['createNewChatSuccess'])

// 定义state
const messageValue = ref('')
const submitLoading = ref(false)
const loadingMsg = ref(false)
const chatContentRef = ref(null)
const isReconnecting = ref(false)
const { token } = theme.useToken();
const appStore = useAppStore()
const userStore = useUserStore()
const modelList = ref([])
// 消息索引
let currentAiMessageIndex = -1
// 初始化消息
const messages = ref([
    {
        placement: 'start',
        text: {
            thinkContent: '',
            answerContent: '你好，我是AI助手，有什么可以帮助你的吗？'
        },
        loading: false,
        thinkMode: false,
        // think: false,
        collapse: false,
    }
])
// 定义选中的模型
const selectedModel = ref('')
const iconStyle = {
    fontSize: 18,
    color: token.value.colorText,
}
// 定义会话ID
const conversationId = ref(null)

//深度思考相关
const isThinkComplete = ref(false);
const isAnswerComplete = ref(false);
const hasThinkStarted = ref(false);
const hasAnswerStarted = ref(false);
const enableThinking = ref(false);
const enableSearch = ref(false);

// Markdown渲染器
const md = markdownit({
    html: true,
    breaks: true,
    linkify: true,
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
    .use(markdownitTaskLists, {
        enabled: true,
        label: true,
        labelAfter: true
    })
    // .use(emoji)
    .use(markdownitSub)      // 下标 H~2~O
    .use(markdownitSup)      // 上标 x^2^
    .use(markdownitMark)     // 高亮 ==marked==

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
const renderMarkdown1 = (content) => {
    // 先用 markdown-it 渲染
    const htmlContent = md.render(content)

    // 再用 DOMPurify 清理 HTML，防止 XSS 攻击
    const safeHtml = DOMPurify.sanitize(htmlContent)

    return h(Typography, null, {
        default: () => h('div', { innerHTML: safeHtml })
    })
    // return h('div', { innerHTML: safeHtml })
}

const renderMarkdown2 = (content) => {
    // 先用 markdown-it 渲染
    const htmlContent = md.render(content)

    // 再用 DOMPurify 清理 HTML，防止 XSS 攻击
    const safeHtml = DOMPurify.sanitize(htmlContent)

    return h(Typography, null, {
        default: () => h('div', { innerHTML: safeHtml })
    })
    // return h('div', { innerHTML: safeHtml })
}

const renderMarkdown3 = (content) => {
    // 先用 markdown-it 渲染
    const htmlContent = md.render(content)

    // 再用 DOMPurify 清理 HTML，防止 XSS 攻击
    const safeHtml = DOMPurify.sanitize(htmlContent)

    return h(Typography, null, {
        default: () => h('div', { innerHTML: safeHtml })
    })
    // return h('div', { innerHTML: safeHtml })
}

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

// 处理发送
const handleSubmit = async (value) => {
    if (!value) return;

    messageValue.value = ''

    // 添加用户消息
    messages.value.push({
        placement: 'end',
        text: {
            thinkContent: '',
            answerContent: value
        },
        loading: false,
        thinkMode: enableThinking.value,
        // think: false,
        collapse: false,
    });

    submitLoading.value = true;

    // 添加AI消息占位
    currentAiMessageIndex = messages.value.length;
    messages.value.push({
        placement: 'start',
        text: {
            thinkContent: '',
            answerContent: ''
        },
        loading: true,
        thinkMode: enableThinking.value,
        // think: true,
        collapse: false,
    });

    scrollToBottom();

    //调用后端接口
    handleChatStream(value)
}

// 处理请求
const handleChatStream = async (value) => {
    // 初始化会话ID
    if (!conversationId.value) {
        conversationId.value = createConversationId(userStore.userData.id)
    }

    // 更新chatDto
    const chatDto = {
        model: selectedModel.value,
        conversationId: conversationId.value,
        prompt: value,
        enableThinking: enableThinking.value,
        enableSearch: enableSearch.value,
    }

    try {
        //后端请求
        const response = await chatStream(chatDto);

        messages.value[currentAiMessageIndex].loading = false;

        if (enableThinking.value) {
            handleThinkingResponse(response)
        } else {
            handleNonThinkingResponse(response)
        }
    } catch (err) {
        console.error('Stream error:', err);
        message.error('请求失败: ' + err.message);

        if (currentAiMessageIndex < messages.value.length) {
            messages.value.splice(currentAiMessageIndex, 1);
        }
    } finally {
        submitLoading.value = false;
    }
};

// 处理非思考模式响应
const handleNonThinkingResponse = async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let lastUpdateTime = 0;
    const updateInterval = 50; // 50ms 更新一次

    try {
        while (true) {
            const { done, value: chunk } = await reader.read();

            if (done) {
                // 最后更新
                if (buffer.trim()) {
                    messages.value[currentAiMessageIndex].text.answerContent += buffer;
                    scrollToBottom();
                }
                console.log('Stream completed');
                break;
            }

            const text = decoder.decode(chunk, { stream: true });
            buffer += text;

            // 节流更新，避免过于频繁的 DOM 操作
            const now = Date.now();
            if (now - lastUpdateTime > updateInterval) {
                if (buffer.trim()) {
                    messages.value[currentAiMessageIndex].text.answerContent += buffer;
                    messages.value[currentAiMessageIndex].loading = false;
                    buffer = '';
                    lastUpdateTime = now;
                    scrollToBottom();
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

// 处理思考模式响应
const handleThinkingResponse = async (response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentMode = null; // 'think' 或 'answer'
    let lastUpdateTime = 0;
    const updateInterval = 50;
    const maxBufferSize = 512 * 1024;

    const processBuffer = () => {
        let processed = false;

        // 查找标识符
        const thinkIndex = buffer.indexOf('THINK:');
        const answerIndex = buffer.indexOf('ANSWER:');

        // 处理 THINK: 标识
        if (thinkIndex !== -1) {
            // 如果之前有内容，先处理
            if (thinkIndex > 0 && currentMode) {
                const prevContent = buffer.substring(0, thinkIndex);
                if (prevContent.trim()) {
                    updateContent(currentMode, prevContent);
                }
            }

            // 切换到思考模式
            currentMode = 'think';
            buffer = buffer.substring(thinkIndex + 6); // 移除 'THINK:'
            processed = true;
        }

        // 处理 ANSWER: 标识
        if (answerIndex !== -1) {
            // 如果之前有内容，先处理
            if (answerIndex > 0 && currentMode) {
                const prevContent = buffer.substring(0, answerIndex);
                if (prevContent.trim()) {
                    updateContent(currentMode, prevContent);
                }
            }

            // 切换到回答模式
            currentMode = 'answer';
            buffer = buffer.substring(answerIndex + 7); // 移除 'ANSWER:'
            processed = true;
        }

        return processed;
    };

    const updateContent = (mode, content) => {
        if (mode === 'think') {
            messages.value[currentAiMessageIndex].text.thinkContent += content;
            if (!hasThinkStarted.value) {
                hasThinkStarted.value = true;
            }
        } else if (mode === 'answer') {
            messages.value[currentAiMessageIndex].text.answerContent += content;
            if (!hasAnswerStarted.value) {
                hasAnswerStarted.value = true;
                // 标记思考完成
                if (hasThinkStarted.value && !isThinkComplete.value) {
                    isThinkComplete.value = true;
                }
            }
        }
        messages.value[currentAiMessageIndex].loading = false;
    };

    try {
        while (true) {
            const { done, value: chunk } = await reader.read();
            if (done) {
                // 处理剩余内容
                if (buffer.trim() && currentMode) {
                    updateContent(currentMode, buffer);
                    scrollToBottom();
                }
                onStreamComplete();
                console.log('Stream completed');
                break;
            }

            const text = decoder.decode(chunk, { stream: true });
            buffer += text;

            // 防止内存溢出
            if (buffer.length > maxBufferSize) {
                console.warn('Buffer size exceeded, forcing update');
                if (currentMode && buffer.trim()) {
                    updateContent(currentMode, buffer);
                    scrollToBottom();
                }
                buffer = '';
                lastUpdateTime = Date.now();
                continue;
            }

            // 尝试处理标识符
            const hasIdentifier = processBuffer();

            // 节流更新内容
            const now = Date.now();
            if (now - lastUpdateTime > updateInterval) {
                if (currentMode && buffer.trim()) {
                    // 如果没有找到新标识符，且当前有模式，则更新内容
                    if (!hasIdentifier) {
                        updateContent(currentMode, buffer);
                        buffer = '';
                        scrollToBottom();
                    }
                }
                lastUpdateTime = now;
            }
        }
    } catch (error) {
        console.error('Stream processing error:', error);

        // 错误处理
        if (buffer.trim() && currentMode) {
            try {
                updateContent(currentMode, buffer);
                scrollToBottom();
            } catch (handleError) {
                console.error('Error handling remaining buffer:', handleError);
            }
        }

        if (currentAiMessageIndex >= 0 && currentAiMessageIndex < messages.value.length) {
            messages.value[currentAiMessageIndex].loading = false;
        }

        onStreamComplete();
        throw error;
    } finally {
        try {
            reader.releaseLock();
        } catch (releaseError) {
            console.error('Error releasing reader lock:', releaseError);
        }
    }
}

const onStreamComplete = () => {
    // 确保所有内容都正确结束
    if (hasThinkStarted.value && !isThinkComplete.value) {
        isThinkComplete.value = true;
    }

    if (hasAnswerStarted.value && !isAnswerComplete.value) {
        isAnswerComplete.value = true;
    }
}

// 取消发送
const handleCancel = () => {
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

// 根据 appStore.themeMode 动态加载高亮主题
const loadHighlightTheme = (mode) => {
    // 先卸载旧样式
    const links = document.querySelectorAll('link[data-highlight-theme]')
    links.forEach(link => link.remove())

    // 按需加载新样式
    const theme = mode === 'dark' ? 'atom-one-dark' : 'atom-one-light'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://cdn.jsdelivr.net/npm/highlight.js@11/styles/${theme}.css`
    link.setAttribute('data-highlight-theme', '')
    document.head.appendChild(link)
}

// 初始化并监听主题变化
loadHighlightTheme(appStore.themeMode)

//根据会话ID查询消息列表
const handleQueryMsgListById = async () => {
    if (!props.conversationId) return
    const res = await queryMessages(props.conversationId)
    // 清空旧消息
    messages.value = []
    if (res.code === 200) {
        messages.value = res.data || []
        loadingMsg.value = false
    }
    // 滚动到底部
    scrollToBottom();
}

watch(() => appStore.themeMode, loadHighlightTheme)

//监听 conversationId 变化
watch(() => props.conversationId, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        conversationId.value = newVal
        loadingMsg.value = true
        // 处理 conversationId 变化后的逻辑
        handleQueryMsgListById()
    }
})

//监听 createNewChat 变化
watch(() => props.createNewChat, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        if (newVal) {
            // 触发创建新会话成功事件
            emit('createNewChatSuccess')
            // 清空旧消息
            messages.value = []
            conversationId.value = props.newConversationId;
            messageValue.value = ''
            messages.value = [{
                placement: 'start',
                content: '你好，我是AI助手，有什么可以帮助你的吗？',
                loading: false
            }]
            // 滚动到底部
            scrollToBottom();
        }
    }
})

// 初始化模型列表
const initModelList = async () => {
    const res = await queryAllModelList()
    if (res.code === 200) {
        modelList.value = res.data || []
        // 初始化选中的模型
        selectedModel.value = modelList.value[0]?.value || ''
    }
}

// 页面加载完成后滚动到底部
onMounted(() => {
    scrollToBottom();
    initModelList()
});

// 组件卸载时取消事件监听
onUnmounted(() => {
    conversationId.value = null
})
</script>

<style scoped lang="scss">
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

        .spin-loading {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

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