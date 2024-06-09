<template>

  <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      router
  >
    <el-menu-item index="1" route="/user" v-if="role === '2' ">
      用户管理
    </el-menu-item>
    <el-menu-item index="2" route="/interCert" v-if="(role === '1') || (role === '2')">查看中间证书</el-menu-item>
    <el-menu-item index="4" route="/cert" v-if="role === '2'">终端证书</el-menu-item>
    <el-menu-item index="3" route="/apply_inter" v-if="(role === '1') || (role === '2')">申请中间证书</el-menu-item>
    <el-menu-item index="5" route="/apply_cert">申请终端证书</el-menu-item>
    <el-menu-item index="6" route="/csr">
      创建CSR请求
    </el-menu-item>
    <el-menu-item index="7" route="/verity_cert">
      验证证书
    </el-menu-item>
    <el-menu-item index="8" route="/my_cert">
      我申请的证书
    </el-menu-item>
    <el-menu-item index="9" route="/key">
      生成RSA密钥对
    </el-menu-item>
<!--    {{ role }}-->
  </el-menu>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'


const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
// 调取用户权限
const role = ref(sessionStorage.getItem("role"))


</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 150px;
}
</style>
