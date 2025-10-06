<template>
  <a-flex horizontal>
    <div class="left">
      <Left />
    </div>
    <div class="right">
      <Right />
    </div>
  </a-flex>
</template>
<script setup>
import Left from './components/Left.vue';
import Right from './components/Right.vue';
import { theme } from 'ant-design-vue';

const { token } = theme.useToken();
</script>

<style scoped lang="scss">
.left {
  width: 18%;
  min-height: 84vh;
  max-height: 88vh;
  background: v-bind('token.colorFillTertiary');
  overflow-y: scroll;
  border-right: 1px solid v-bind('token.colorBorder');
  padding: 20px;
}

.right {
  width: 82%;
  background: v-bind('token.colorBgContainer');
  min-height: 84vh;
  max-height: 88vh;
}
</style>
