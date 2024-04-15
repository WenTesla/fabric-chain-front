<template>
  switch parent border:
  <el-switch v-model="parentBorder"/>
  switch child
  border:
  <el-switch v-model="childBorder"/>
  <el-table :data="tableData" :border="parentBorder" style="width: 100%">
    <el-table-column type="expand">

      <template #default="props">
        {{ props.row }}
        <el-button type="primary"  @click="deleteCert">Delete</el-button>

      </template>

    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {CertsInfo} from "~/api/cert";

const parentBorder = ref(false)
const childBorder = ref(false)
const tableData = ref([])

const getCerts = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    const response = await CertsInfo()
    if (response.data) {
      // 加载状态改变
      // loading.value = false
      let data = response.data;
      data.forEach(cert => {

      });
      tableData.value = data
      console.log(data)
    }

  } catch (error) {
  }

}
onMounted(() => {
  getCerts();
});
const deleteCert = () => {

}
</script>
