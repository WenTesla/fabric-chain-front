<template>
  <el-header>
    <Menu></Menu>
  </el-header>

  <div class="login-container">
    <div class="login-box">
      <h2 style="text-align: center; margin-bottom: 20px;">欢迎登陆</h2>

      <el-form
        :label-position="labelPosition"
        label-width="auto"
        :model="form"
        style="max-width: 400px"
    >
      <Input :send-id="getId" :send-password="getPassword"/>
<!--      <el-form-item label="Sign">-->
<!--&lt;!&ndash;        <upload/>&ndash;&gt;-->

<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit"
                   :loading="isLoading" style="margin: auto"
        >登录
        </el-button>
      </el-form-item>
    </el-form>
    </div>
<!--    {{ form }}-->
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormProps} from 'element-plus'
import upload from '../components/upload.vue'
import {Login, LoginData, UserRole} from "~/api/user";
import {ElMessage} from "element-plus";
import router from "~/route";
import {successMsg} from "~/components/base_component.vue";

const labelPosition = ref<FormProps['labelPosition']>('right')
const isLoading = ref(false)

const form = reactive({
  id: '',
  password: '',
})

function getId(value: string) {
  form.id = value;
  console.log(value)
}

function getPassword(value: string) {
  form.password = value
  console.log(value)
}

const handleSubmit = async () => {
  isLoading.value=true
  // 准备数据
  let formData = new FormData;
  formData.append("id",form.id)
  formData.append("password",form.password)
  await loginWithFormData(formData)
  console.log("submit")
  isLoading.value=false
}

async function loginWithFormData(formData) {
  try {
    console.log(formData);
    const response = await Login(formData as LoginData);
    console.log(response);
    handleResponse(response);
  } catch (error) {
    handleError(error)
  }
}

function handleResponse(response) {
  if (response.status === 200) {
    successMsg(response.data.status_msg);
    isLoading.value=false
    // 获取用户角色
    setRole()
    // 存放cookie
    sessionStorage.setItem('id',form.id);
    router.push("/back")
  } else {
    errorMsg(response.data);
    isLoading.value=false
  }
}

function handleError(error) {
  if (error.response) {
    // 根据具体的错误状态码或类型，可以提供更详细的错误消息
    errorMsg(error.response.data.status_msg || 'An error occurred while processing the response.');
  } else {
    errorMsg(error);
  }
}

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
// 设置用户
async function setRole() {
  let formData = new FormData;
  formData.append("id", form.id)
  let response = await UserRole(formData);
  if (response.status === 200)
  {
    sessionStorage.setItem("role",response.data.data)
  }
}
</script>

<style>
 .login-container {
   background-image: url('https://s2.loli.net/2024/06/09/mgGv2hlHQIte7En.jpg');
   background-size: cover;
   background-position: center;
   background-repeat: no-repeat;
   min-height: 100vh;
   padding-top: 100px;
   text-align: -webkit-center;
 }
.login-box {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  margin: 50px auto;
  max-width: 500px;
}
</style>