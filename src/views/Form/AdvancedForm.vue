<template>
  <div class="advanced-form">
    <a-card title="高级表单">
      <a-form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        @finish="onFinish"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="项目名称" name="projectName">
              <a-input v-model:value="formState.projectName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目编号" name="projectCode">
              <a-input v-model:value="formState.projectCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始日期" name="startDate">
              <a-date-picker v-model:value="formState.startDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束日期" name="endDate">
              <a-date-picker v-model:value="formState.endDate" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="项目成员" name="members">
          <a-select
            v-model:value="formState.members"
            mode="multiple"
            placeholder="请选择项目成员"
          >
            <a-select-option value="user1">张三</a-select-option>
            <a-select-option value="user2">李四</a-select-option>
            <a-select-option value="user3">王五</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目描述" name="description">
          <a-textarea v-model:value="formState.description" :rows="6" />
        </a-form-item>
        <a-form-item label="附件上传" name="files">
          <a-upload
            v-model:file-list="fileList"
            name="file"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            :headers="headers"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              点击上传
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" html-type="submit">提交</a-button>
          <a-button style="margin-left: 10px">保存草稿</a-button>
          <a-button style="margin-left: 10px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'

const formState = reactive({
  projectName: '',
  projectCode: '',
  startDate: null,
  endDate: null,
  members: [],
  description: ''
})

const fileList = ref([])
const headers = {
  authorization: 'authorization-text'
}

const onFinish = (values) => {
  console.log('Success:', values)
}
</script>

<style scoped>
.advanced-form {
  padding: 24px;
}
</style>