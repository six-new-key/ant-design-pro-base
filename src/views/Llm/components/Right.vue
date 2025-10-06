<template>
    <div class="right-wrapper">
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
                            <a-button>
                                <template #icon>
                                    <ShareAltOutlined />
                                </template>
                            </a-button>
                            <a-button>
                                <template #icon>
                                    <EllipsisOutlined />
                                </template>
                            </a-button>
                        </a-space>
                    </template>
                </AXWelcome>
            </div>
            <!-- 对话消息 -->
            <div class="chat-messages">
                <div v-for="(msg, index) in messages" :key="index" class="message-item">
                    <AXBubble 
                        :placement="msg.placement" 
                        :loading="msg.loading" 
                        :content="msg.content"
                        :avatar="{ icon: h(UserOutlined), style: msg.placement === 'end' ? barAvatar : fooAvatar }" 
                    />
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
import { UserOutlined } from '@ant-design/icons-vue';
import { message } from '@/utils';
import SenderMsg from './SenderMsg.vue'

// 定义state
const messageValue = ref('')
const loading = ref(false)
const chatContentRef = ref(null)

// SSE相关变量
let eventSource = null
let currentAiMessageIndex = -1

// 初始化一些历史消息
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

const fooAvatar = {
    color: '#f56a00',
    backgroundColor: '#fde3cf',
};

const barAvatar = {
    color: '#fff',
    backgroundColor: '#87d068',
};

// 滚动到底部函数
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

// 页面加载完成后滚动到底部
onMounted(() => {
    setTimeout(() => {
        scrollToBottom();
    }, 1000);
});

// 关闭SSE连接
const closeSSEConnection = () => {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
        console.log('SSE连接已关闭');
    }
    loading.value = false;
};

// 处理标准SSE格式数据
const processSSEData = (rawData) => {
    // 标准SSE格式: "data:内容\n\n"
    // 我们需要提取"data:"后面的内容
    if (rawData.startsWith('data:')) {
        // 提取"data:"后面的内容，并去掉末尾的换行符
        return rawData.substring(5).replace(/\n\n$/, '');
    }
    return rawData;
};

// 使用fetch API处理流式数据
const connectWithFetch = async (userMessage) => {
    const encodedMessage = encodeURIComponent(userMessage);
    const url = `http://localhost:8201/llm/chat?msg=${encodedMessage}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('响应体不可读');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // 创建AI消息占位
        currentAiMessageIndex = messages.value.length;
        messages.value.push({
            placement: 'start',
            content: '',
            loading: true
        });
        
        scrollToBottom();

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('流式响应结束');
                    break;
                }
                
                const chunk = decoder.decode(value, { stream: true });
                console.log('原始数据:', chunk);
                
                // 处理标准SSE格式数据
                const processedChunk = processSSEData(chunk);
                console.log('处理后数据:', processedChunk);
                
                // 更新消息内容
                if (currentAiMessageIndex !== -1 && processedChunk) {
                    messages.value[currentAiMessageIndex].content += processedChunk;
                    messages.value[currentAiMessageIndex].loading = false;
                    scrollToBottom();
                }
            }
        } finally {
            reader.releaseLock();
        }
        
        loading.value = false;
        console.log('AI回复完成');
        
    } catch (error) {
        console.error('获取流式数据错误:', error);
        if (currentAiMessageIndex !== -1) {
            messages.value[currentAiMessageIndex].content = `抱歉，获取回复时出现错误: ${error.message}`;
            messages.value[currentAiMessageIndex].loading = false;
        }
        loading.value = false;
        message.error('连接失败: ' + error.message);
    }
};

// 使用SSE连接处理流式数据
const connectSSE = (userMessage) => {
    closeSSEConnection();

    const encodedMessage = encodeURIComponent(userMessage);
    const url = `http://localhost:8201/llm/chat?msg=${encodedMessage}`;

    try {
        eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.log('SSE连接已建立');
        };

        eventSource.onmessage = (event) => {
            console.log('SSE原始消息:', event.data);
            
            // 处理标准SSE格式数据
            const processedData = processSSEData(event.data);
            console.log('SSE处理后消息:', processedData);
            
            if (currentAiMessageIndex !== -1 && processedData) {
                messages.value[currentAiMessageIndex].content += processedData;
                messages.value[currentAiMessageIndex].loading = false;
                scrollToBottom();
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE连接错误:', error);
            
            // 如果连接出错，但已经有部分内容，保持内容不变
            if (currentAiMessageIndex !== -1 && messages.value[currentAiMessageIndex].content === '') {
                messages.value[currentAiMessageIndex].content = '连接异常，请重试';
                messages.value[currentAiMessageIndex].loading = false;
            }
            
            closeSSEConnection();
            message.error('连接异常');
        };

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

const handleSubmit = async (value) => {
    if (!value) return;

    messageValue.value = ''
    
    // 1. 添加用户发送的消息
    messages.value.push({
        placement: 'end',
        content: value,
        loading: false
    });
    
    scrollToBottom();
    
    // 设置loading状态
    loading.value = true;
    
    // 2. 优先使用SSE方式连接
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

const handleCancel = () => {
    closeSSEConnection();
    messageValue.value = ''
    message.error('已取消发送');
}

// 组件卸载时自动关闭连接
onUnmounted(() => {
    closeSSEConnection();
});
</script>

<style scoped lang="scss">
.right-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 50px 0 50px;

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
        background-color: #fff;
    }
}
</style>