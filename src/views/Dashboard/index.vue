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

      <div>
        <span>图标测试</span>
        <div>
          <a-space>
            <IconFont 
              type="icon-space_demo_dashboard-fill_down"
              size="20px" 
              :script-url="iconScriptUrl"
            />
            <IconFont 
              type="icon-shequ" 
              size="20px" 
              :script-url="iconScriptUrl"
            />
            <IconFont 
              type="icon-shouye" 
              size="30px" 
              :script-url="iconScriptUrl"
            />
          </a-space>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
// 定义图标脚本地址
const iconScriptUrl = '//at.alicdn.com/t/c/font_4736930_l6olb1tzza.js';
</script>

<style scoped>
.dashboard {
  /* padding: 24px; */
  height: 200vh;
}
</style>