<template>

</template>

<script >
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

export function downName(data,name) {
  let blob = stringToBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name; // 设置下载文件的名称
  link.click();

  URL.revokeObjectURL(url);

}

function stringToBlob(str, type = 'text/plain;charset=utf-8') {
  const encoder = new TextEncoder(); // 创建一个 TextEncoder 实例
  const data = encoder.encode(str); // 将字符串编码为 Uint8Array
  return new Blob([data], {type}); // 创建一个 Blob 对象
}

export function timestampToString(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0'); // 用0填充
  const min = String(date.getMinutes()).padStart(2, '0'); // 用0填充
  return `${year}-${month}-${day} ${hour}:${min}`;
}

</script>

<style scoped>

</style>