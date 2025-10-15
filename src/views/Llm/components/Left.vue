<template>
  <div class="left-content">
    <div class="create-new-chat">
      <a-button type="primary" size="large" block @click="handleCreateNewChat">新建对话</a-button>
    </div>

    <div class="chat-history">
      <AXConversations :activeKey="activeKey" :menu="menuConfig" :items="historyList" :style="style" @activeChange="handleActiveChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h, computed } from 'vue'
import { EditOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { queryHistory } from '@/api'
import { message, createConversationId } from '@/utils'
import { theme } from 'ant-design-vue';
import { useAppStore, useUserStore } from '@/stores'

const emit = defineEmits(['activeChange', 'createNewChat'])

const historyList = ref([])
const { token } = theme.useToken();
const appStore = useAppStore()
const userStore = useUserStore()

const activeKey = ref('')

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

// const style = computed(() => ({
//   width: '100%',
//   height: '100%',
//   background: token.value.colorFillTertiary,
//   borderRadius: token.value.borderRadius,
// }));

const handleActiveChange = (key) => {
  emit('activeChange', key)
  activeKey.value = key
}

const handleCreateNewChat = () => {
  //新建会话ID
  const conversationId = createConversationId(userStore.userData.id);
  emit('createNewChat', conversationId)
  //TODO：逻辑不对，要先新建一个会话ID ，新增一个空的会话
  historyList.value.unshift({
    key: conversationId,
    label: '新会话',
    timestamp: null,
    group: '',
    icon: '',
    disabled: false,
  })
  activeKey.value = conversationId
}

const handleQueryHistory = () => {
  queryHistory().then(res => {
    console.log(res.data)
    historyList.value = res.data || []
  })
}


onMounted(() => {
  handleQueryHistory()
})
</script>

<style lang="scss" scoped>
.left-content {
  position: relative;
  height: 100%;

  .create-new-chat {
    padding: 0 6px;
    height: 50px;
    width: 100%;
    display: flex;
    align-items: flex-end;
  }

  .chat-history {
    height: calc(100% - 50px);
    width: 100%;
    overflow-y: scroll;
  }
}
</style>
