<template>
  <div class="basic-form">
    <a-card title="基础表单">
      <a-form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 14 }"
        @finish="onFinish"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formState.description" :rows="4" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formState.status">
            <a-select-option value="active">激活</a-select-option>
            <a-select-option value="inactive">未激活</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button style="margin-left: 10px">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const formState = reactive({
  title: '',
  description: '',
  status: 'active'
})

const onFinish = (values) => {
  console.log('Success:', values)
}
</script>

<style scoped>
.basic-form {
  padding: 24px;
}
</style>