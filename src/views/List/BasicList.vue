<template>
  <div class="basic-list">
    <a-card title="标准列表">
      <a-list
        :data-source="listData"
        :pagination="pagination"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a key="list-edit">编辑</a>
              <a key="list-more">更多</a>
            </template>
            <a-list-item-meta
              :description="item.description"
            >
              <template #title>
                <a href="#">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar :src="item.avatar" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const listData = ref([
  {
    title: '列表项目1',
    description: '这是列表项目1的描述信息',
    avatar: 'https://joeschmoe.io/api/v1/random'
  },
  {
    title: '列表项目2',
    description: '这是列表项目2的描述信息',
    avatar: 'https://joeschmoe.io/api/v1/random'
  },
  {
    title: '列表项目3',
    description: '这是列表项目3的描述信息',
    avatar: 'https://joeschmoe.io/api/v1/random'
  }
])

const pagination = {
  current: 1,
  pageSize: 5,
  total: 3
}
</script>

<style scoped>
.basic-list {
  padding: 24px;
}
</style>