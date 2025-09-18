<template>
  <div class="search-articles">
    <a-card title="搜索列表（文章）">
      <div class="search-bar">
        <a-input-search
          v-model:value="searchValue"
          placeholder="请输入搜索关键词"
          enter-button="搜索"
          size="large"
          @search="onSearch"
        />
      </div>
      <a-list
        :data-source="articles"
        :pagination="pagination"
        item-layout="vertical"
        size="large"
      >
        <template #renderItem="{ item }">
          <a-list-item key="item.title">
            <template #actions>
              <span><star-outlined /> {{ item.star }}</span>
              <span><like-outlined /> {{ item.like }}</span>
              <span><message-outlined /> {{ item.message }}</span>
            </template>
            <template #extra>
              <img width="272" alt="logo" :src="item.image" />
            </template>
            <a-list-item-meta :description="item.description">
              <template #title>
                <a :href="item.href">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar :src="item.avatar" />
              </template>
            </a-list-item-meta>
            {{ item.content }}
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'

const searchValue = ref('')
const articles = ref([
  {
    title: 'Vue 3 最佳实践',
    avatar: 'https://joeschmoe.io/api/v1/random',
    description: '发布于 2024-01-01',
    content: '这是一篇关于Vue 3最佳实践的文章，介绍了如何使用Composition API...',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    star: 156,
    like: 156,
    message: 2,
    href: '#'
  },
  {
    title: 'Ant Design Vue 组件库使用指南',
    avatar: 'https://joeschmoe.io/api/v1/random',
    description: '发布于 2024-01-02',
    content: '详细介绍了Ant Design Vue组件库的使用方法和最佳实践...',
    image: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
    star: 98,
    like: 98,
    message: 5,
    href: '#'
  }
])

const pagination = {
  current: 1,
  pageSize: 5,
  total: 2
}

const onSearch = (value) => {
  console.log('搜索:', value)
}
</script>

<style scoped>
.search-articles {
  padding: 24px;
}
.search-bar {
  margin-bottom: 24px;
}
</style>