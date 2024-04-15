<template>

  <el-form-item label="UserId" >
    <el-input v-model="id"
              placeholder="Please input UserId"
              clearable
              @input="sendId(id)"
    />
  </el-form-item>
  <el-form-item label="Password">
    <el-input
        v-model="password"
        type="password"
        placeholder="Please input Password"
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