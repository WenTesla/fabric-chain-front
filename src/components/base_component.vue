<template>

</template>

<script setup lang="ts">
import {ElMessage} from "element-plus";

export const successMsg = (msg) => {
  ElMessage({
    message: msg,
    type: 'success',
    grouping: true
  })
}
export const errorMsg = (msg) => {
  ElMessage({
    message: msg,
    type: "error",
    // duration: 0,
    showClose: true,
    grouping: true
  })
}

export function down(data) {
  let blob = stringToBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'filename.txt'; // 设置下载文件的名称
  link.click();

  URL.revokeObjectURL(url);

}

function stringToBlob(str, type = 'text/plain;charset=utf-8') {
  const encoder = new TextEncoder(); // 创建一个 TextEncoder 实例
  const data = encoder.encode(str); // 将字符串编码为 Uint8Array
  return new Blob([data], {type}); // 创建一个 Blob 对象
}
</script>

<style scoped>

</style>