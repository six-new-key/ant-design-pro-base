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
                    <AXBubble :placement="msg.placement" :loading="msg.loading" :avatar="getAvatarStyle(msg.placement)"
                        :variant="msg.placement === 'start' ? 'outlined' : 'filled'" shape="corner">
                        <template v-if="chatDto.enableThinking" #message>
                            <Space>
                                <BulbOutlined />
                                <span>{{ think ? "思考中..." : "已深度思考" }}</span>
                                <Button type="text" size="small" style="background: transparent;"
                                    :icon="collapse ? h(UpOutlined) : h(DownOutlined)" @click="() => {
                                        collapse = !collapse;
                                    }" />
                            </Space>
                        </template>
                        <template #footer>
                            <!-- <a-space :size="token.paddingXXS">
                                <a-button type="text" size="small" :icon="h(SyncOutlined)"
                                    @click="handleRetry(index)" />
                                <a-button type="text" size="small" :icon="h(CopyOutlined)"
                                    @click="handleCopy(content)" />
                            </a-space> -->
                            <Space direction="vertical">
                                <div v-if="chatDto.enableThinking">
                                    <Bubble v-show="!collapse" variant="borderless" :typing="true"
                                        :content="thinkContent" :message-render="renderMarkdown" />
                                </div>
                                <LoadingOutlined v-if="think" />
                                <Bubble variant="borderless" style="margin-top: -24px;" :typing="true"
                                    :content="chatDto.enableThinking ? answerContent : answerContent" :message-render="renderMarkdown" />
                            </Space>
                        </template>
                    </AXBubble>
                </div>
            </div>
        </div>

        <!-- 消息发送区：固定在底部 -->
        <div class="sender">
            <AXSender :allow-speech="true" :actions="false" v-model:value="messageValue"
                :auto-size="{ minRows: 3, maxRows: 8 }" @submit="handleSubmit" @cancel="handleCancel">
                <template #footer="{ info: { components: { SendButton, LoadingButton, SpeechButton } } }">
                    <a-flex justify="space-between" align="center">
                        <a-flex gap="small" align="center">
                            <a-select v-model:value="selectedModel" style="width: 120px"
                                :options="modelList"></a-select>
                            <a-divider type="vertical" />
                            深度思考
                            <a-switch v-model:checked="chatDto.enableThinking" />
                            <a-divider type="vertical" />
                            联网搜索
                            <a-switch v-model:checked="chatDto.enableSearch" />
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
// 定义选中的模型
const selectedModel = ref('')
const iconStyle = {
    fontSize: 18,
    color: token.value.colorText,
}
// 定义会话ID
const conversationId = ref(null)
const chatDto = ref({
    model: selectedModel.value,
    conversationId: conversationId.value,
    prompt: messageValue.value,
    enableThinking: false,
    enableSearch: false,
})
const collapse = ref(false);
const think = ref(false);
const currentType = ref(null); // 'think' 或 'answer'
const thinkContent = ref('');
const answerContent = ref('');
const isThinkComplete = ref(false);
const isAnswerComplete = ref(false);
const isStreamComplete = ref(false);
const hasThinkStarted = ref(false);
const hasAnswerStarted = ref(false);

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

// SSE相关变量
let currentAiMessageIndex = -1

// 初始化消息
const messages = ref([
    {
        placement: 'start',
        content: '你好，我是AI助手，有什么可以帮助你的吗？',
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
const renderMarkdown = (content) => {
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
        content: value,
        loading: false
    });

    submitLoading.value = true;

    // 添加AI消息占位
    currentAiMessageIndex = messages.value.length;
    messages.value.push({
        placement: 'start',
        content: '',
        loading: true
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
    chatDto.value = {
        model: selectedModel.value,
        conversationId: conversationId.value,
        prompt: value,
        enableThinking: chatDto.value.enableThinking,
        enableSearch: chatDto.value.enableSearch,
    }

    try {
        const response = await chatStream(chatDto.value);

        if (!chatDto.value.enableThinking) {
            handleNonThinkingResponse(response)
        } else {
            handleThinkingResponse(response)
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
                    messages.value[currentAiMessageIndex].content += buffer;
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
                    messages.value[currentAiMessageIndex].content += buffer;
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
    const decoder = new TextDecoder('utf-8');

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                onStreamComplete();
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            console.log('原始数据块:', chunk);

            // 按行分割处理
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.trim()) {
                    handleStreamData(line.trim());
                }
            }
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            throw error;
        }
    }
}

/**
 * 处理流式数据 - 根据版本3的后端格式
 */
const handleStreamData = (data) => {
    console.log('收到数据:', data);

    // 处理思考内容 (以THINK:开头)
    if (data.startsWith('THINK:')) {
        currentType.value = 'think';
        const content = data.replace('THINK:', '');
        thinkContent.value += content;
        if (!hasThinkStarted.value) {
            hasThinkStarted.value = true;
        }
    }
    // 处理回答内容 (以ANSWER:开头)
    else if (data.startsWith('ANSWER:')) {
        currentType.value = 'answer';
        const content = data.replace('ANSWER:', '');
        answerContent.value += content;

        if (!hasAnswerStarted.value) {
            hasAnswerStarted.value = true;

            // 标记思考完成
            if (hasThinkStarted.value && !isThinkComplete.value) {
                isThinkComplete.value = true;
            }
        }
    }
    // 处理普通数据（追加到当前类型）
    else if (data.trim() !== '') {
        if (currentType.value === 'think') {
            thinkContent.value += data;
        } else if (currentType.value === 'answer') {
            answerContent.value += data;
        }
    }
}

/**
 * 处理流结束
 */
const onStreamComplete = () => {
    console.log('流式传输结束');
    console.log('最终思考内容:', thinkContent.value);
    console.log('最终回答内容:', answerContent.value);

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