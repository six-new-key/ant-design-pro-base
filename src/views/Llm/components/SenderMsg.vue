<template>
    <AXSender :allow-speech="true" :value="message" :loading="loading" :auto-size="{ minRows: 4, maxRows: 8 }"
        @update:value="updateValue" @submit="submit" @cancel="cancel" />
</template>
<script setup>

// 定义props
const props = defineProps({
    message: {
        type: String,
        default: '很好听'
    },
    loading: {
        type: Boolean,
        default: false
    }
})

//向外暴露方法
const emit = defineEmits(['update:message', 'submit', 'cancel'])

// 更新消息值
const updateValue = (value) => {
    emit('update:message', value)
}

// 提交消息
const submit = (value) => {
    emit('submit', value)
}

// 取消发送
const cancel = () => {
    emit('cancel')
}
</script>