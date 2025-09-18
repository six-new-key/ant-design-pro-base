<template>
  <div class="card-list">
    <a-card title="卡片列表">
      <a-row :gutter="[16, 16]">
        <a-col :span="8" v-for="item in cardData" :key="item.id">
          <a-card hoverable>
            <template #cover>
              <img alt="example" :src="item.cover" />
            </template>
            <template #actions>
              <setting-outlined key="setting" />
              <edit-outlined key="edit" />
              <ellipsis-outlined key="ellipsis" />
            </template>
            <a-card-meta :title="item.title" :description="item.description" />
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'

const cardData = ref([
  {
    id: 1,
    title: '卡片标题1',
    description: '这是卡片1的描述信息',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
  },
  {
    id: 2,
    title: '卡片标题2',
    description: '这是卡片2的描述信息',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
  },
  {
    id: 3,
    title: '卡片标题3',
    description: '这是卡片3的描述信息',
    cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
  }
])
</script>

<style scoped>
.card-list {
  padding: 24px;
}
</style>