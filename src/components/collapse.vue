<template>

  <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      router
  >
    <el-menu-item index="1" route="/user" v-if="role === '2' ">
      User
    </el-menu-item>
    <el-menu-item index="2" route="/interCert" v-if="role === '2'">Intermediate-cert</el-menu-item>
    <el-menu-item index="4" route="/cert" v-if="role === '2'">Leaf-cert</el-menu-item>
    <el-menu-item index="3" route="/apply_inter" v-if="role ===  '1'|| '2'" >Apply intermediate-cert</el-menu-item>
    <el-menu-item index="5" route="/apply_cert">Apply leaf-cert</el-menu-item>
    <el-menu-item index="6" route="/csr">
      Create Csr
    </el-menu-item>
    <el-menu-item index="7" route="/verity_cert">
      Cert Verify
    </el-menu-item>
    <el-menu-item index="8" route="/my_cert">
      My cert
    </el-menu-item>
    {{ role }}
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
  width: 200px;
  min-height: 400px;
}
</style>
