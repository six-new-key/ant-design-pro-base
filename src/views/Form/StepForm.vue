<template>
  <div class="step-form">
    <a-card title="分步表单">
      <a-steps :current="current">
        <a-step title="基本信息" />
        <a-step title="详细配置" />
        <a-step title="完成" />
      </a-steps>
      <div class="steps-content">
        <div v-if="current === 0">
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="项目名称">
              <a-input v-model:value="formData.name" />
            </a-form-item>
            <a-form-item label="项目描述">
              <a-textarea v-model:value="formData.description" />
            </a-form-item>
          </a-form>
        </div>
        <div v-if="current === 1">
          <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
            <a-form-item label="项目类型">
              <a-select v-model:value="formData.type">
                <a-select-option value="web">Web应用</a-select-option>
                <a-select-option value="mobile">移动应用</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="优先级">
              <a-radio-group v-model:value="formData.priority">
                <a-radio value="high">高</a-radio>
                <a-radio value="medium">中</a-radio>
                <a-radio value="low">低</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </div>
        <div v-if="current === 2">
          <a-result status="success" title="表单提交成功!" sub-title="您的信息已经成功提交。" />
        </div>
      </div>
      <div class="steps-action">
        <a-button v-if="current > 0" @click="prev">上一步</a-button>
        <a-button v-if="current < 2" type="primary" @click="next">下一步</a-button>
        <a-button v-if="current === 2" type="primary" @click="done">完成</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const current = ref(0)
const formData = reactive({
  name: '',
  description: '',
  type: 'web',
  priority: 'medium'
})

const next = () => {
  current.value++
}

const prev = () => {
  current.value--
}

const done = () => {
  console.log('Form completed:', formData)
  current.value = 0
}
</script>

<style scoped>
.step-form {
  padding: 24px;
}
.steps-content {
  margin-top: 32px;
  margin-bottom: 32px;
  min-height: 200px;
}
.steps-action {
  text-align: center;
}
.steps-action .ant-btn {
  margin: 0 8px;
}
</style>