<template>
  <div class="dashboard">
    <a-card title="仪表盘">
      <p>欢迎来到仪表盘页面</p>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-statistic title="用户数" :value="1128" />
        </a-col>
        <a-col :span="8">
          <a-statistic title="订单数" :value="93" suffix="/ 100" />
        </a-col>
        <a-col :span="8">
          <a-statistic title="活跃用户" :value="93" suffix="%" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
// 仪表盘页面
</script>

<style scoped>
.dashboard {
  /* padding: 24px; */
  height: 200vh;
}
</style>