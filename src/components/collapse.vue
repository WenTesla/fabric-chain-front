<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :value="false">expand</el-radio-button>
    <el-radio-button :value="true">collapse</el-radio-button>
  </el-radio-group>
  <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      router
  >
    <el-menu-item index="1" route="/user">
      <el-icon>
        <User/>
      </el-icon>
      <template #title>User</template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group>
        <template #title><span>Cert</span></template>
        <el-menu-item index="1-1" route="/interCert">intermediate-cert</el-menu-item>
        <el-menu-item index="1-2" route="/csr">apply intermediate-cert</el-menu-item>
        <el-menu-item index="1-3" route="/cert">leaf-cert</el-menu-item>
        <el-menu-item index="1-4" route="/cert">apply leaf-cert</el-menu-item>
      </el-menu-item-group>

    </el-sub-menu>
    <el-menu-item index="3" route="/csr">

      <template #title>CSR</template>
    </el-menu-item>
    <el-menu-item index="4" route="/csr">

      <template #title>Cert Verify</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {
  User
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
