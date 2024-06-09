<template>
  <!--  <el-input-->
  <!--      v-model="form.Id"-->
  <!--      style="width: 240px"-->
  <!--      placeholder="Please input"-->
  <!--      clearable-->
  <!--  />-->
  <div style="max-width: 400px;margin: auto  ;);
">

    <el-form-item>
      <el-upload
          :limit="1"
          class="upload-demo"
          :auto-upload="false"
          @change="handleFileUpload1"
      >
        <el-button type="primary">选择</el-button>
        <div class="el-upload__tip">
          上传CSR
        </div>
      </el-upload>

    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="isLoading">
        上传
      </el-button>
    </el-form-item>
    <!--    {{ form }}-->
  </div>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {CreateCsr, registerIntermediateCert, requestCert} from "~/api/cert";
import {errorMsg, successMsg} from "./base_component.vue"
import {down} from "~/components/base_component.vue";

const selectedFile = ref();
const form = reactive({
  csr: '',
  Id: sessionStorage.getItem("id"),
})
const isLoading = ref(false)

const handleFileUpload1 = (file) => {
  // file 是当前选择的文件对象，fileList 是当前已选择的文件列表
  selectedFile.value = file.raw; // raw 属性包含了原始的 File 对象
  form.csr = file.raw
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


async function submit() {
  isLoading.value = true
  console.log(form)
  try {
    let formData = new FormData;
    formData.append("csr", form.csr)
    formData.append("userId", form.Id)
    const response = await requestCert(formData);
    console.log(response)
    if (response.status == 200) {
      successMsg("success")
      successMsg(response.data.data)
    } else {
      errorMsg(response.data.status_msg)
    }
  } catch (e) {
    errorMsg(e)
  }
  isLoading.value = false
}
</script>

<style scoped>
.background-image {
  background-image: url('https://s2.loli.net/2024/06/09/MtzIfwupasGRdJj.png');
  background-size: cover;
  background-position: center;
}
</style>