<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="certId" label="certId" width="150"/>
    <el-table-column fixed prop="version" label="version" width="100"/>
    <el-table-column fixed prop="beginDate" label="beginDate" width="150"/>
    <el-table-column fixed prop="endDate" label="endDate" width="150"/>
    <el-table-column fixed prop="certHashValue" label="certHashValue" width="180"/>
    <el-table-column fixed prop="userId" label="userId" width="100"/>
    <el-table-column fixed prop="status" label="status" width="100"/>

    <!--    操作-->
    <el-table-column fixed="right" label="Operations" width="250">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="down(scope.row.certBytes,scope.row.userId)"
        >Down
        </el-button
        >
        <el-button link type="primary" size="small" @click="Issue(scope.row.certId)"
        >Issue
        </el-button
        >
        <el-button link type="primary" size="small" @click="Revoke(scope.row.certId)"
        >Revoke
        </el-button
        >
        <el-button link type="primary" size="small" @click="Delete(scope.row.certId)"
        >Delete
        </el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="centerDialogVisible" title="Key" width="500" center>
    <span>
      {{ dialogContent }}
    </span>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible"
      title="Are you sure"
      width="500"
  >
    <span>Will delete it forever</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="ConfirmDelete">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {ApproveCert, DeleteCert, LeafCertsInfo, RevokeCert} from "~/api/cert";
import {downName, errorMsg, successMsg, timestampToString} from "~/components/base_component.vue";

const tableData = ref([]); // 创建一个响应式引用，用于存储表格数据
const centerDialogVisible = ref(false)
const dialogContent = ref("")
const dialogVisible = ref(false)
const isConfirm = ref(false)
const confirmCertId = ref()

const getCertsInfo = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    const response = await LeafCertsInfo()
    if (response.data) {
      // 加载状态改变
      // loading.value = false
      let data = response.data;
      if (!data)
        return
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



const Delete = async certId => {
  dialogVisible.value = true
  confirmCertId.value = certId
}

async function ConfirmDelete() {
  dialogVisible.value = false
  let formData = new FormData;
  formData.append("id", confirmCertId.value)
  let response = await DeleteCert(formData);
  if (response.status == 200) {
    successMsg("success")
    successMsg(response.data.status_msg)
    getCertsInfo()
  } else {
    errorMsg(response.data.data.status_msg)
  }
}


const Detail = certId => {
  console.log("Detail")
  centerDialogVisible.value = true
  dialogContent.value = certId
}

const down =  (data,id) => {
  downName(data,id+".txt")
}

const Issue = async certId => {
  let formData = new FormData;
  formData.append("id", certId)
  let response = await ApproveCert(formData);
  if (response.status == 200) {
    successMsg("success")
    successMsg(response.data.status_msg)
    getCertsInfo()
  } else {
    errorMsg(response.data.status_msg)
  }
}

const Revoke = async certId => {
  let formData = new FormData;
  formData.append("id", certId)
  let response = await RevokeCert(formData);
  if (response.status == 200) {
    successMsg(response.data.status_msg)
    getCertsInfo()

  } else {
    errorMsg(response.data.status_msg)
  }
}



</script>
