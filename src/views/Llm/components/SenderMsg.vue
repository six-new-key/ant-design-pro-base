<template>
    <AXSender :allow-speech="true" :value="message" :loading="loading" :auto-size="{ minRows: 4, maxRows: 8 }"
        @update:value="updateValue" @submit="submit" @cancel="cancel">
        <template #prefix>
            <a-select v-model:value="selectedModel" style="width: 120px" :options="modelList"></a-select>
        </template>
    </AXSender>
</template>
<script setup>
import { ref, computed } from 'vue'

// 定义props
const props = defineProps({
    message: {
        type: String,
        default: '很好听'
    },
    loading: {
        type: Boolean,
        default: false
    },
    modelList: {
        type: Array,
        default: () => []
    }
})

// 定义选中的模型
const selectedModel = computed(() => {
    return props.modelList[0]?.value
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