<template>
  <el-form-item>
    <el-upload
        :limit="1"
        class="upload-demo"
        :auto-upload="false"
        @change="handleFileUpload"
    >
      <el-button type="primary">Click to upload</el-button>
      <div class="el-upload__tip">
        please load your cert
      </div>
    </el-upload>

  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submit" :loading="isLoading">
      submit
    </el-button>
  </el-form-item>
</template>
<script lang="ts" setup>
import {VerityCert} from "~/api/cert";
import {errorMsg, successMsg} from "~/components/base_component.vue";
import {ref} from "vue";

const selectedFile = ref();
const isLoading = ref(false)

async function submit() {
  isLoading.value = true
  let formData = new FormData;
  formData.append("cert", selectedFile.value)
  try {
    const response = await VerityCert(formData);
    console.log(response)
    if (response.status == 200) {
      successMsg(response.data.data)
    } else {
      errorMsg(response.data.status_msg)
    }
  }catch (e) {
    console.log(e.response.data)
    errorMsg(e.response.data.status_msg)

  }
  isLoading.value = false
}

const handleFileUpload = (file) => {
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
</script>
