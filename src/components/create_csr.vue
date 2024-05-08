<template>
  <el-form :model="form" label-width="auto" style="max-width: 400px">
    <el-form-item label="C">
      <el-input v-model="form.C"/>
    </el-form-item>
    <el-form-item label="ST">
      <el-input v-model="form.ST"/>
    </el-form-item>
    <el-form-item label="L">
      <el-input v-model="form.L"/>
    </el-form-item>
    <el-form-item label="O">
      <el-input v-model="form.O"/>
    </el-form-item>
    <el-form-item label="OU">
      <el-input v-model="form.OU"/>
    </el-form-item>
    <el-form-item label="CN">
      <el-input v-model="form.CN"/>
    </el-form-item>
    <el-form-item label="EmailAddress">
      <el-input v-model="form.EmailAddress"/>
    </el-form-item>
    <el-form-item label="DnsEmail">
      <el-input v-model="form.DnsEmail"/>
    </el-form-item>
    <el-form-item label="pri">

      <el-upload
          :limit="1"
          class="upload-demo"
          :auto-upload="false"
          @change="handleFileUpload"
      >
        <el-button type="primary" >Click to upload</el-button>
        <div class="el-upload__tip">
          please load your key
        </div>
      </el-upload>

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit" :loading="isLoading">Create CSR</el-button>
      <el-button @click="clearForm">Reset</el-button>
    </el-form-item>

    {{ form }}
  </el-form>
</template>

<script setup lang="ts">
import {reactive,ref} from 'vue'
import {CreateCsr} from "~/api/cert";
import {ElMessage} from "element-plus";
import {errorMsg, successMsg} from "~/components/base_component.vue";

const  isLoading = ref(false)

const selectedFile = ref();
const form = reactive({
  C: '',
  ST: '',
  L: '',
  O: '',
  OU: '',
  CN: '',
  EmailAddress: '',
  DnsEmail: '',
})
// 定义一个方法来清空form对象
function clearForm() {
  for (const key in form) {
    if (form.hasOwnProperty(key)) {
      form[key] = ''; // 将每个属性的值设置为空字符串
    }
  }
}

const submit = async () => {
  isLoading.value=true
  console.log(form)
  try {
    let formData = new FormData;
    formData.append("C", form.C)
    formData.append("ST", form.ST)
    formData.append("L", form.L)
    formData.append("O", form.O)
    formData.append("OU", form.OU)
    formData.append("CN", form.CN)
    formData.append("EmailAddress", form.EmailAddress)
    formData.append("DNSAddress", form.DnsEmail)
    formData.append("pri", selectedFile.value)
    const response = await CreateCsr(formData);
    console.log(response)
    if (response.status == 200) {
      successMsg("success")
      down(response.data)
    }else {
      errorMsg(response.data.status_msg)
    }
  } catch (e) {
      errorMsg(e)
  }
  isLoading.value=false
}

const handleFileUpload = (file, fileList) => {
  // file 是当前选择的文件对象，fileList 是当前已选择的文件列表
  selectedFile.value = file.raw; // raw 属性包含了原始的 File 对象
  console.log(selectedFile.value); // 打印文件对象，可以在这里进行文件内容的读取
  const reader = new FileReader();
  reader.onload = (e) => {
    const fileContent = e.target.result; // 文件内容
    console.log(fileContent); // 打印文件内容
    // 可以在这里进行文件内容的处理或发送到服务器
  };
  reader.readAsText(selectedFile.value); // 假设你想以文本形式读取文件
  // 设置
}


function down(data) {
  let blob = stringToBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'filename.txt'; // 设置下载文件的名称
  link.click();

  URL.revokeObjectURL(url);

}

function stringToBlob(str, type = 'text/plain;charset=utf-8') {
  const encoder = new TextEncoder(); // 创建一个 TextEncoder 实例
  const data = encoder.encode(str); // 将字符串编码为 Uint8Array
  return new Blob([data], {type}); // 创建一个 Blob 对象
}
</script>

<style scoped>

</style>