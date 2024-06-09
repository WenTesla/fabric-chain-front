<template>
  <el-header>
    <Menu></Menu>
  </el-header>

  <div class="register-container">
    <div class="transparent-box">

    <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="form"
        style="max-width: 400px"
    >
      <Input :send-id="getId" :send-password="getPassword"/>
      <el-form-item label="确定密码">
        <el-input
            type="password"
            placeholder="请重复输入密码"
            show-password
            clearable
            v-model="confirmValue"
            @blur="checkIsSame"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"
                  placeholder="请输入邮箱"
                  clearable
        />
      </el-form-item>
      <el-form-item>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="上传公钥"
            placement="left"
        >
          <el-switch v-model="isChecked" style="margin: auto"/>
        </el-tooltip>
        <el-upload
            v-show="isChecked"
            :limit="1"
            class="upload-demo"
            :auto-upload="false"
            @change="handleFileUpload"
        >
          <el-button type="primary" @click="submitUpload">点击上传</el-button>
          <div class="el-upload__tip" style="margin-left: 40px">
            请上传你的公钥
          </div>
        </el-upload>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading" style="margin: auto"
        >注册
        </el-button>
      </el-form-item>

    </el-form>
  </div>
  </div>
</template>

<script lang="ts" setup>

import {reactive, ref, onMounted} from 'vue'
import type {FormProps, FormRules, UploadInstance, UploadProps, UploadRawFile, UploadUserFile} from 'element-plus'
import {Register, RegisterByGenRSA, RegisterData, RegisterWithCert} from "~/api/user";
import {ElMessage, ElMessageBox, genFileId} from 'element-plus'
import Input from "~/components/input.vue";
import Menu from "~/components/menu.vue";
import {downName} from "~/components/base_component.vue";
import router from "~/route";


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
    return false
  }

}

const isChecked = ref(false)

// 处理表单提交的方法
const handleSubmit = async () => {
  if (!form.id || !form.password) {
    errorMsg("请填写账号密码")
    return
  }
  if (confirmValue.value != form.password) {
    errorMsg("两次密码不正确")
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
  formData.append('publickey', selectedFile.value)

  try {
    console.log(formData)

    // 发送POST请求到服务器
    const response = await RegisterWithCert(formData as RegisterData)
    console.log(response)
    // 处理响应
    if (response.status == 200) {
      successMsg(response.data.status_msg)
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
    if (response.status === 200) {
      successMsg("系统会自动生成RSA公私密钥，公钥已存入系统，请保存好你的私钥")
      downName(response.data,form.id+'.key')
      setTimeout(()=>{
        console.log("111")
      },3000)
      router.push("/login")
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
    message: 'Success',
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



const handleFileUpload = (file) => {
  // file 是当前选择的文件对象，fileList 是当前已选择的文件列表
  selectedFile.value = file.raw; // raw 属性包含了原始的 File 对象
  form.publickey = file.raw
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
  background-image: url('https://s2.loli.net/2024/06/09/mgGv2hlHQIte7En.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding-top: 100px;
  text-align: -webkit-center;
}

.transparent-box {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid black;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 50px auto;
  max-width: 500px;
}
</style>

