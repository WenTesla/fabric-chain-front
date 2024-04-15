<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
      router
  >
    <el-menu-item index="0" route="login">
      fabric
    </el-menu-item>
    <div class="flex-grow"/>
    <el-menu-item index="1" route="register">Register</el-menu-item>
    <el-menu-item index="2" route="login">Login</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import {ref} from "vue";

const activeIndex = ref('2')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  activeIndex.value=key
  console.log("当前的activeIndex：",activeIndex.value)
}

</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>