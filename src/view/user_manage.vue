<template>
  <el-header>
  <user_menu></user_menu>
  </el-header>
  <el-container>
    <el-aside width="200px"><collapse></collapse></el-aside>
    <el-main><users/></el-main>
  </el-container>

</template>

<script lang="ts" setup>
import Users from "~/components/users.vue";

</script>
