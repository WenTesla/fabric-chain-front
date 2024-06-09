<template>
  <el-header>
    <user_menu></user_menu>
  </el-header>
  <el-container style="  background-image: url('https://s2.loli.net/2024/06/09/MtzIfwupasGRdJj.png');
">    <el-aside width="200px">
      <collapse></collapse>
    </el-aside>
    <el-main>
      <genkey></genkey>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">

import Genkey from "~/components/Genkey.vue";
</script>

<style scoped>

</style>