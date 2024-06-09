<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="certId" label="证书ID" width="150"/>
    <el-table-column fixed prop="version" label="版本" width="70"/>
    <el-table-column fixed prop="beginDate" label="开始时间" width="150"/>
    <el-table-column fixed prop="endDate" label="结束时间" width="150"/>
    <el-table-column fixed prop="subject" label="主题" width="200"/>
    <el-table-column fixed prop="issuer" label="颁发" width="200"/>
    <el-table-column fixed prop="certHashValue" label="证书HASH值" width="180"/>
    <el-table-column fixed prop="userId" label="所有者ID" width="100"/>
    <el-table-column fixed prop="status" label="状态" width="100"/>
    <el-table-column fixed="right" label="Operations" width="250">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="Down(scope.row.certBytes)"
        >下载
        </el-button>

      </template>
    </el-table-column>
  </el-table>

</template>

<script setup lang="ts">
import {LeafCertsInfo, MyCert} from "~/api/cert";
import {onMounted, ref} from "vue";
import {down, errorMsg, timestampToString} from "~/components/base_component.vue";

const tableData = ref()
const getCertsInfo = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    let formData = new FormData;
    formData.append("id",sessionStorage.getItem("id"))
    const response = await MyCert(formData)
    if (response.data) {
      // 加载状态改变
      // loading.value = false
      let data = response.data;
      data.forEach(cert => {
        if (cert.status === 0) {
          cert.beginDate = ""
          cert.endDate = ""
        } else {
          cert.beginDate = timestampToString(cert.beginDate)
          cert.endDate = timestampToString(cert.endDate)
        }
        cert.status = cert.status === 0 ? '审核中' : cert.status === 1 ? '已批准' : '已撤销';
      });
      tableData.value = data
      console.log(data)
    }

  } catch (error) {
    errorMsg(error)
  }

};
onMounted(() => {
  getCertsInfo();
});

const Down = (data) => {
  console.log(data)
  down(data)
}
</script>

<style scoped>

</style>