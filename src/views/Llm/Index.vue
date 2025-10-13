<template>
  <a-flex horizontal>
    <div class="left">
      <Left @activeChange="handleActiveChange" />
    </div>
    <div class="right">
      <Right :conversationId="conversationId" />
    </div>
  </a-flex>
</template>
<script setup>
import { ref } from 'vue'
import Left from './components/Left.vue';
import Right from './components/Right.vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();

const conversationId = ref('')

const handleActiveChange = (key) => {
  conversationId.value = key
}
</script>

<style scoped lang="scss">
//隐藏滚动条
::-webkit-scrollbar {
    display: none;
}
.left {
  width: 18%;
  min-height: 84vh;
  max-height: 88vh;
  // background: v-bind('token.colorFillTertiary');
  overflow-y: auto;
  border-right: 1px solid v-bind('token.colorBorder');
}

.right {
  width: 82%;
  background: v-bind('token.colorBgContainer');
  min-height: 84vh;
  max-height: 88vh;
}
</style>
