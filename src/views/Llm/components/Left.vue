<template>
  <div class="left-content">
    <AXConversations default-active-key="item1" :menu="menuConfig" :items="historyList" :style="style" />
  </div>
</template>

<script setup>
import { ref, onMounted ,h,computed} from 'vue'
import { EditOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { queryHistory } from '@/api'
import { message } from '@/utils'
import { theme } from 'ant-design-vue';

const historyList = ref([])
const { token } = theme.useToken();

const menuConfig = (conversation) => ({
  items: [
    {
      label: 'Operation 1',
      key: 'operation1',
      icon: h(EditOutlined),
    },
    {
      label: 'Operation 2',
      key: 'operation2',
      icon: h(StopOutlined),
      disabled: false,
    },
    {
      label: 'Operation 3',
      key: 'operation3',
      icon: h(DeleteOutlined),
      danger: true,
    },
  ],
  onClick: (menuInfo) => {
    message.info(`Click ${conversation.key} - ${menuInfo.key}`);
  },
});

const style = computed(() => ({
  width: '100%',
  height: '100%',
  background: token.value.colorFillTertiary,
  borderRadius: token.value.borderRadius,
}));

onMounted(() => {
  queryHistory().then(res => {
    console.log(res.data)
    historyList.value = res.data || []
  })
})
</script>

<style lang="scss" scoped>
.left-content {
  height: 100%;
}
</style>
