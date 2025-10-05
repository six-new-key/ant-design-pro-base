<template>
  <a-card class="chat-container">
    <a-flex gap="middle" vertical>
      <AXBubble placement="start" content="Good morning, how are you?"
        :avatar="{ icon: h(UserOutlined), style: fooAvatar }" />
      <AXBubble placement="start" content="What a beautiful day!" :styles="{ avatar: hideAvatar }" :avatar="{}" />
      <AXBubble placement="end" content="Hi, good morning, I'm fine!">
        <template #avatar>
          <a-avatar :icon="h(UserOutlined)" :style="barAvatar" />
        </template>
      </AXBubble>
      <AXBubble placement="end" content="Thank you!" :styles="{ avatar: hideAvatar }" :avatar="{}" />
    </a-flex>
  </a-card>
</template>

<script setup>
import { UserOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';

const fooAvatar = {
  color: '#f56a00',
  backgroundColor: '#fde3cf',
};

const barAvatar = {
  color: '#fff',
  backgroundColor: '#87d068',
};

const hideAvatar = {
  visibility: 'hidden',
};
</script>