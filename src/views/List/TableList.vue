<template>
  <div class="table-list">
    <a-card title="查询表格">
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form layout="inline" :model="searchForm" @finish="onSearch">
          <a-form-item label="名称" name="name">
            <a-input v-model:value="searchForm.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-select v-model:value="searchForm.status" placeholder="请选择状态" style="width: 120px">
              <a-select-option value="">全部</a-select-option>
              <a-select-option value="active">激活</a-select-option>
              <a-select-option value="inactive">未激活</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" @click="handleAdd">新建</a-button>
        <a-button @click="handleBatchDelete" :disabled="!hasSelected">批量删除</a-button>
      </div>
      
      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-selection="rowSelection"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'green' : 'red'">
              {{ record.status === 'active' ? '激活' : '未激活' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a @click="handleDelete(record)">删除</a>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

const loading = ref(false)
const selectedRowKeys = ref([])
const searchForm = reactive({
  name: '',
  status: ''
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'action'
  }
]

const dataSource = ref([
  {
    id: 1,
    name: '项目A',
    description: '这是项目A的描述',
    status: 'active',
    createTime: '2024-01-01'
  },
  {
    id: 2,
    name: '项目B',
    description: '这是项目B的描述',
    status: 'inactive',
    createTime: '2024-01-02'
  }
])

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 2,
  showSizeChanger: true,
  showQuickJumper: true
})

const rowSelection = {
  selectedRowKeys,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  }
}

const hasSelected = computed(() => selectedRowKeys.value.length > 0)

const onSearch = (values) => {
  console.log('搜索:', values)
  // 这里实现搜索逻辑
}

const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
}

const handleAdd = () => {
  console.log('新建')
}

const handleEdit = (record) => {
  console.log('编辑:', record)
}

const handleDelete = (record) => {
  console.log('删除:', record)
}

const handleBatchDelete = () => {
  console.log('批量删除:', selectedRowKeys.value)
}

const handleTableChange = (pag, filters, sorter) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.table-list {
  padding: 24px;
}
.search-form {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
}
.table-operations {
  margin-bottom: 16px;
}
.table-operations .ant-btn {
  margin-right: 8px;
}
</style>