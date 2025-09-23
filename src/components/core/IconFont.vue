<template>
  <component 
    :is="IconFont" 
    :type="type" 
    :style="iconStyle"
  />
</template>

<script setup>
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { computed } from 'vue';

// 定义组件属性
const props = defineProps({
  // 图标类型
  type: {
    type: String,
    required: true
  },
  // 图标大小
  size: {
    type: [String, Number],
    default: '16px'
  },
  // Iconfont 脚本地址
  scriptUrl: {
    type: String,
    required: true
  },
  // 额外的通用属性配置
  extraCommonProps: {
    type: Object,
    default: () => ({})
  }
});

// 创建 IconFont 组件实例
const IconFont = computed(() => {
  return createFromIconfontCN({
    scriptUrl: props.scriptUrl,
    extraCommonProps: props.extraCommonProps
  });
});

// 计算图标样式
const iconStyle = computed(() => {
  const style = {};
  
  if (props.size) {
    style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
  }
  
  return style;
});
</script>
