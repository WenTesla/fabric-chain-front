<template>
  <div style="margin: auto; max-width: 400px">
    <el-select v-model="selectedKeyLength" placeholder="请选择RSA密钥长度" style="max-width: 200px">
      <el-option
          v-for="item in keyLengthOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-divider></el-divider>
    <el-button type="primary" @click="gen" style="margin-top: 100px">生成RSA密钥对</el-button>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {GenRSA} from "~/api/cert";
import {downName, errorMsg, success, successMsg} from "~/components/base_component.vue";

const selectedKeyLength = ref()
const keyLengthOptions = ref([
  { value: '1024', label: '1024位' },
  { value: '2048', label: '2048位' },
  { value: '4096', label: '4096位' },
  // 可以添加更多选项...
]);
async function gen() {
  let formData = new FormData;
  formData.append("bit", selectedKeyLength.value)
  try {
    let response = await GenRSA(formData);
    success()
    downName(response.data.data,"key.txt")
  } catch (e) {
    errorMsg(e.response.data)
  }
}
</script>

<style scoped>

</style>