<template>
  <el-header>
    <user_menu></user_menu>
  </el-header>
  <el-container>
    <el-aside width="200px"><collapse></collapse></el-aside>
    <el-main><Create_csr></Create_csr></el-main>
  </el-container>
</template>

<script setup lang="ts">
import Create_csr from "~/components/create_csr.vue";





</script>

<style scoped>

</style>