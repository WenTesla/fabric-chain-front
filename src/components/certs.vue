<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="certId" label="certId" width="150" />
    <el-table-column fixed prop="version" label="version" width="150" />
    <el-table-column fixed prop="beginDate" label="beginDate" width="150" />
    <el-table-column fixed prop="endDate" label="endDate" width="150" />
    <el-table-column fixed prop="certHashValue" label="certHashValue" width="150" />
    <el-table-column fixed prop="userId" label="userId" width="150" />
    <el-table-column fixed prop="status" label="status" width="150" />

<!--    操作-->
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick"
        >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="centerDialogVisible" title="Key" width="500" center>
    <span>
      {{ dialogContent }}
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {CertsInfo} from "~/api/cert";
import {ElMessage} from "element-plus";

const tableData = ref([]); // 创建一个响应式引用，用于存储表格数据
const centerDialogVisible = ref(false)
const dialogContent = ref()

const getCertsInfo = async () => {
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
      tableData.value=data
      console.log(data)
    }

  }catch (error) {
    errorMsg(error)
  }

};
onMounted(() => {
  getCertsInfo();
});

const handleClick = () => {
  console.log('click')
}


const errorMsg = (msg) => {
  ElMessage({
    message: msg,
    type: "error",
    showClose: true,
    grouping: true
  })
}
function timestampToString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0'); // 用0填充
  const min = String(date.getMinutes()).padStart(2, '0'); // 用0填充
  return `${year}-${month}-${day} ${hour}:${min}`;
}
</script>
