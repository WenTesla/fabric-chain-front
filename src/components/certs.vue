<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="certId" label="证书ID" width="120"/>
    <el-table-column fixed prop="version" label="版本" width="70"/>
    <el-table-column fixed prop="Date" label="有效时间" width="250"/>
<!--    <el-table-column fixed prop="endDate" label="结束时间" width="150"/>-->
    <el-table-column fixed prop="subject" label="所有者" width="200"/>
    <el-table-column fixed prop="issuer" label="颁发者" width="200"/>
    <el-table-column fixed prop="certHashValue" label="证书HASH值" width="180"/>
    <el-table-column fixed prop="userId" label="所有者ID" width="100"/>
    <el-table-column fixed prop="status" label="状态" width="70"/>

    <!--    操作-->
    <el-table-column fixed  label="操作" width="100">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="down(scope.row.certBytes,scope.row.userId)"
        >下载
        </el-button
        >
        <el-button link type="primary" size="small" @click="dialogFormVisible=true;form.id=scope.row.certId;form.userId=scope.row.userId"
        >颁发
        </el-button
        >
        <el-button link type="primary" size="small" @click="Revoke(scope.row.certId)"
        >撤销
        </el-button
        >
        <el-button link type="primary" size="small" @click="Delete(scope.row.certId)"
        >删除
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
      title="你确定吗？"
      width="500"
  >
    <span>将会永远删除</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ConfirmDelete">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible" title="请选择中间证书与私钥进行颁发" width="500">
    <el-form :model="form">
      <el-form-item label="中间证书 ID">
        <el-select v-model="form.interId" placeholder="请选择中间证书">
          <el-option
              v-for="item in interData"
              :key="item.value"
              :label="`${item.id}`"
              :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应的私钥" >
        <el-upload
            :limit="1"
            class="upload-demo"
            :auto-upload="false"
            @change="handleFileUpload"
        >
          <el-button type="primary">选择文件</el-button>
          <div class="el-upload__tip" style="margin-left: 5px">
            请上传私钥
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="Issue" :loading="isLoading">
          颁发
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ApproveCert, CertsInfo, DeleteCert, LeafCertsInfo, RevokeCert} from "~/api/cert";
import {downName, errorMsg, successMsg, timestampToString} from "~/components/base_component.vue";
import {DrawerProps} from "element-plus";

const tableData = ref([]); // 创建一个响应式引用，用于存储表格数据
const centerDialogVisible = ref(false)
const dialogContent = ref("")
const dialogVisible = ref(false)
const confirmCertId = ref()
const direction = ref<DrawerProps['direction']>('rtl')
const form = reactive({
  pri: "",
  interId:"",
  id:"",
  userId:"",
  issuerId:""
})
const interData = ref([])
const isLoading =  ref(false)
const getCerts = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    const response = await CertsInfo()
    if (response.data) {
      // 加载状态改变
      // loading.value = false
      let data = response.data;
      interData.value = response.data
      console.log(data)
    }
  } catch (error) {

  }

}

const dialogFormVisible = ref(false)
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
          cert.Date = cert.beginDate+" "+cert.endDate
        }

        cert.status = cert.status === 0 ? '审核中' : cert.status === 1 ? '已批准' : '已撤销';
        cert.certHashValue=cert.certHashValue.substring(0, 10)+".."
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
  getCerts()
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

const down = (data, id) => {
  downName(data, id + ".crt")
}

const Issue = async () => {
  let formData = new FormData;
  formData.append("id", form.id)
  formData.append("issuerId", sessionStorage.getItem("id"))
  formData.append("userId", form.userId)
  formData.append("interId", form.interId)
  formData.append("pri", form.pri)
  isLoading.value=true
  try {
    let response = await ApproveCert(formData);
    if (response.status == 200) {
      successMsg(response.data.status_msg)
      getCertsInfo()
    } else {
      errorMsg(response.data.status_msg)
    }
  }catch (e) {
    errorMsg(e.response.data.status_msg)
  }
  isLoading.value=false
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
const handleFileUpload = (file) => {
  // file 是当前选择的文件对象，fileList 是当前已选择的文件列表
  form.pri = file.raw
}


</script>
