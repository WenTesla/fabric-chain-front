<template>
  <!--  switch parent border:-->
  <!--  <el-switch v-model="parentBorder"/>-->
  <!--  switch child-->
  <!--  border:-->
  <!--  <el-switch v-model="childBorder"/>-->
  <!--  <el-table :data="tableData" :border="parentBorder" style="width: 100%">-->
  <!--    <el-table-column type="expand">-->

  <!--      <template #default="props">-->
  <!--        {{ props.row }}-->
  <!--        <el-button type="primary"  @click="downCert(props.row)">Down</el-button>-->

  <!--      </template>-->

  <!--    </el-table-column>-->

  <!--  </el-table>-->
  <el-watermark :font="font" :content="[content]">
    <div style="height: 500px">
      <el-collapse accordion>

        <el-collapse-item
            v-for="(item, index) in tableData"
            :key="index"
            :title="`证书Id:${item.id} `"
            :name="index.toString()"
        >
          <el-divider></el-divider>
          HASH:
          <pre v-html="item.hashValue"></pre>
          <el-divider></el-divider>
          <el-button type="primary" @click="downName(item.content,'inter.crt')">下载</el-button>
        </el-collapse-item>

      </el-collapse>
    </div>
  </el-watermark>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {CertsInfo} from "~/api/cert";
import {downName} from "~/components/base_component.vue";

const parentBorder = ref(false)
const childBorder = ref(false)
const tableData = ref([])
const font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const content = ref(sessionStorage.getItem("id"))
const getCerts = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    const response = await CertsInfo()
    if (response.data) {
      // 加载状态改变
      // loading.value = false
      let data = response.data;
      data.forEach(cert => {

      });
      tableData.value = data
      console.log(data)
    }

  } catch (error) {
  }

}
onMounted(() => {
  getCerts();
});
const downCert = (data) => {
  downName(data, "1" + ".crt")
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
