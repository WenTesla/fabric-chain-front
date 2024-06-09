<template>
  <el-header>
    <user_menu></user_menu>
  </el-header>
  <el-container style="  background-image: url('https://s2.loli.net/2024/06/09/MtzIfwupasGRdJj.png');
">    <el-aside width="200px"><collapse></collapse></el-aside>
    <el-main><Certs/></el-main>
  </el-container>
</template>

<script lang="ts" setup>
import Certs from "~/components/certs.vue";
import Collapse from "~/components/collapse.vue";

</script>

<style scoped>

</style>