<template>
  <el-page-header @back="onBack">
    <template #content>
      <div class="flex items-center">

        <span class="text-large font-600 mr-3"> {{ userInfo.Id }} </span>

        <el-tag style="margin-left: 10px">{{ userInfo.role }}</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
<!--        <el-button type="primary" class="ml-2" plain @click="open">Detail</el-button>-->
        <el-button type="primary" class="ml-2" plain @click="open">修改密码</el-button>
      </div>
    </template>
  </el-page-header>
</template>


<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {UpdatePassword, User} from "~/api/user";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "~/route";
import route from "~/route";
import {useRoute} from "vue-router";

const id = ref()
const userInfo = ref(
    {
      Id: sessionStorage.getItem("id"),
      role: ''
    }
)
const userId = ref(sessionStorage.getItem("id"))
async function getUserInfo() {
  const route = useRoute();
  // id.value = route.params.id
  let formData = new FormData;
  formData.append("id", userInfo.value.Id)
  const response = await User(formData)
  if (response.data) {
    let parse = JSON.parse(response.data.data);
    userInfo.value.Id = parse.Id
    userInfo.value.role = parse.isCA == 0 ? '普通用户' :
        parse.isCA === 1 ? '审计员' :
            parse.isCA === 2 ? '管理员' :
                '未知';
  } else {
    errorMsg("失败")
  }
}

const errorMsg = (msg) => {
  ElMessage({
    message: msg,
    type: "error",
    showClose: true,
    grouping: true
  })
}
const success = () => {
  ElMessage({
    message: 'success！',
    type: 'success',
  })
}

onMounted(() => {
  getUserInfo();
});

const open = () => {
  ElMessageBox.prompt('Please input your password', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
        /^\d{6,}$/,
    inputErrorMessage: 'Invalid Password',
    inputType: 'password'
  })
      .then(({value}) => {

        update(userInfo.value.Id, value)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Input canceled',
        })
      })
}

async function update(id, password) {
  let formData = new FormData;
  formData.append("Id", userInfo.value.Id)
  formData.append("password", password)
  let response = await UpdatePassword(formData);
  if (response.status === 200) {
    if (response.data.status_code === 0) {
      success()
    } else {
      errorMsg(response.data.data.status_msg)
    }
    return
  } else {
    errorMsg("失败")
  }
}

const onBack = () => {
  console.log("Back")
  router.back()
}
</script>


