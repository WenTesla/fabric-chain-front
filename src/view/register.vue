<template>
  <el-header>
    <Menu></Menu>
  </el-header>

  <div class="register-container">
    <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="form"
        style="max-width: 400px"
    >
      <Input :send-id="getId" :send-password="getPassword"/>
      <el-form-item label="Confirm">
        <el-input
            type="password"
            placeholder="Please input Password"
            show-password
            clearable
            v-model="confirmValue"
            @blur="checkIsSame"
        />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email"
                  placeholder="Please input your email"
                  clearable
        />
      </el-form-item>
      <el-form-item>
        <el-switch v-model="isChecked"/>

        <el-upload
            v-show="isChecked"
            :limit="1"
            class="upload-demo"
            :auto-upload="false"
            @change="handleFileUpload"
        >
          <el-button type="primary" @click="submitUpload">Click to upload</el-button>
          <div class="el-upload__tip">
            please load your key
          </div>
        </el-upload>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading"
        >register
        </el-button>
      </el-form-item>
      {{ form }}
      {{ isChecked }}
    </el-form>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref, onMounted} from 'vue'
import type {FormProps, FormRules, UploadInstance, UploadProps, UploadRawFile, UploadUserFile} from 'element-plus'
import {RegisterByGenRSA, RegisterData, RegisterWithCert} from "~/api/user";
import {ElMessage, ElMessageBox, genFileId} from 'element-plus'
import Input from "~/components/input.vue";
import Menu from "~/components/menu.vue";


const labelPosition = ref<FormProps['labelPosition']>('right')
const isLoading = ref(false)
const uploadRef = ref<UploadInstance>()

const form = reactive({
  id: '',
  password: '',
  email: '',
  publickey: '',
})
let confirmValue = ref("")
const selectedFile = ref();

function checkIsSame() {
  if (confirmValue.value != form.password) {
    errorMsg("两次密码不正确")
  }
}

const isChecked = ref(false)

// 处理表单提交的方法
const handleSubmit = async () => {
  if (!form.id || !form.password) {
    errorMsg("请填写账号密码")
    return
  }
  console.log(isChecked.value)
  isLoading.value = true
  // 分别处理
  if (isChecked.value == true) {
    await handleSwitchOn()
  } else {
    await handleSwitchOff()
  }
  isLoading.value = false

}

function getId(value: string) {
  form.id = value;
}

function getPassword(value: string) {
  form.password = value
}

// 当 switch 打开时执行的函数
async function handleSwitchOn() {
  console.log('Switch is on');
  // 这里可以执行打开 switch 时需要做的操作，比如初始化上传组件等
  // 准备请求的数据
  const formData = new FormData()
  formData.append('id', form.id)
  formData.append('password', form.password) // 假设后端字段名为password
  formData.append('email', form.email)
  // 添加文件
  // formData.append('publickey', form.publickey)
  formData.append('publickey', selectedFile.value)

  try {
    console.log(formData)

    // 发送POST请求到服务器
    const response = await RegisterWithCert(formData as RegisterData)
    console.log(response)
    // 处理响应
    if (response.status == 200) {
      successMsg(response.data)
    } else {
      // 检查response是否有data属性
      if (response.data) {
        // 如果后端在400响应中提供了data，则使用它
        errorMsg(response.data);
      } else {
        // 如果没有data，则可能需要从其他属性（如statusText）中获取错误信息
        errorMsg(`服务器返回错误状态码 ${response.status}: ${response.statusText}`);
      }
    }
  } catch (error) {
    console.log("失败:", error)
    errorMsg(error.response.data.status_msg)
  }
}

// 当 switch 关闭时执行的函数
async function handleSwitchOff() {
  console.log('Switch is off');
  // 这里可以执行关闭 switch 时需要做的操作，比如清除上传组件的状态等
  const formData = new FormData()
  formData.append('id', form.id)
  formData.append('password', form.password) // 假设后端字段名为password
  formData.append('email', form.email)
  try {
    console.log(formData)
    // 发送POST请求到服务器
    const response = await RegisterByGenRSA(formData as RegisterData)
    console.log(response)
    // 处理响应
    if (response.status == 200) {
      successMsg(response.data)
      // 下载文件
      down(response.data)
      // router.push("/login")
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    if (error.response) {
      errorMsg(error.response.data.status_msg)
      return
    }
    errorMsg(error)
  }
}

const upload = ref<UploadInstance>()


const handleChange = (uploadFile) => {
  console.log("handleChange")
  selectedFile.value = uploadFile;
};

const errorMsg = (msg) => {
  ElMessage({
    message: msg,
    type: "error",
    // duration: 0,
    showClose: true,
    grouping: true
  })
}

const success = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}
const successMsg = (msg) => {
  ElMessage({
    message: msg,
    type: 'success',
    grouping: true
  })
}


const submitUpload = () => {
  console.log('submitUpload')

};

const beforeUpload = (rawFile: File) => {
  console.log("beforeUpload")
  const isTxt = rawFile.type === 'text/plain';
  const isLt2M = rawFile.size / 1024 / 1024 < 2;
  console.log(rawFile)
  if (!isTxt) {
    alert('上传文件只能是 txt 格式!');
    return false;
  }
  if (!isLt2M) {
    alert('上传文件大小不能超过 2MB!');
    return false;
  }
  return true;
};

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

const handleFileUpload = (file, fileList) => {
  // file 是当前选择的文件对象，fileList 是当前已选择的文件列表
  selectedFile.value = file.raw; // raw 属性包含了原始的 File 对象
  form.publickey=file.raw
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

<style scoped>
.register-container {
  padding-top: 100px;
  text-align: -webkit-center;
}
</style>

