<template>

  <el-form-item label="ID" >
    <el-input v-model="id"
              placeholder="请输入ID"
              clearable
              @input="sendId(id)"
    />
  </el-form-item>
  <el-form-item label="密码">
    <el-input
        v-model="password"
        type="password"
        placeholder="请输入密码"
        show-password
        clearable
        @input="sendPassword(password)"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { ref} from "vue";
let id = ref()
let password =ref()
defineProps(['sendId','sendPassword'])
</script>

<style scoped>

</style>