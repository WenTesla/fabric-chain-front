<template>
  <el-header>
    <user_menu></user_menu>
  </el-header>
  <el-container>
    <el-aside width="200px"><collapse></collapse></el-aside>
    <el-main><register-inter-cert/></el-main>
  </el-container>
</template>

<script setup lang="ts">
import RegisterInterCert from "~/components/register-inter-cert.vue";

</script>

<style scoped>

</style>