<template>
  <el-table :data="tableData" style="width: 100%" v-loading="loading">
    <el-table-column prop="Id" label="Id" width="120"/>
    <el-table-column prop="email" label="邮箱" width="160"/>
    <el-table-column prop="role" label="角色" width="120"/>
    <el-table-column prop="createTime" label="创建时间" width="160"/>
    <el-table-column prop="updateTime" label="修改时间" width="160"/>
    <el-table-column prop="lastLoginTime" label="最后登录时间" width="160"/>
    <el-table-column prop="status" label="状态" width="100"/>
    <el-table-column prop="publicKey" label="公钥" width="100">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="keyDetail(scope.row.publicKey)"
        >查看
        </el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="140">
      <template #default="scope">
        <!--        <el-button link type="primary" size="small" @click="handleClick(scope.row)"-->
        <!--        > {{ scope.row.status === "正常" ? 'Ban' : 'UnBan' }}-->
        <!--        </el-button-->
        <!--        >-->
        <el-button link type="primary" @click="handleClick(scope.row)">
          <el-icon>
            <lock v-if="scope.row.status === '正常'"
            />
            <Unlock v-else-if="scope.row.status === '封禁'"/>
          </el-icon>
        </el-button>

        <el-button link type="primary" size="small" @click="upgrade(scope.row.Id)">
          <el-icon>
            <Top/>
          </el-icon>
        </el-button>
        <el-button link type="primary" size="small" @click="degrade(scope.row.Id)">
          <el-icon>
            <Bottom/>
          </el-icon>
        </el-button>
        <el-button link type="primary" size="small" @click="deleteUser(scope.row.Id)">
          <el-icon>
            <Delete/>
          </el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!--  对话框-->
  <el-dialog v-model="centerDialogVisible" title="Key" width="500" center>
    <span>
      {{ dialogContent }}
    </span>
  </el-dialog>
  <el-dialog
      v-model="dialogVisible"
      title="Are you sure"
      width="500"
  >
    <span>Will delete it forever</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="ConfirmDelete">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

// 当加载页面时候自动获取参数
import {onMounted, ref} from "vue";
import {BanUser, DegradeUser, DeleteUser, UnBanUser, UpgradeUser, UserInfo} from "~/api/user";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "~/route";
import {Delete, Lock, Unlock, Top, Bottom} from "@element-plus/icons-vue";
const dialogVisible = ref(false)
const loading = ref(true)
const centerDialogVisible = ref(false)
const tableData = ref([]); // 创建一个响应式引用，用于存储表格数据
const dialogContent = ref("")
const confirmCertId = ref()
// 定义要在组件挂载后调用的函数
const getUsersInfo = async () => {
  console.log('组件已挂载，函数被自动调用');
  // 在这里你可以访问和修改响应式数据，比如 someData.value
  try {
    const response = await UserInfo()
    if (response.data) {
      // 加载状态改变
      loading.value = false
      let data = response.data;
      // 将时间戳转为string类型
      data.forEach(user => {
        // 假设时间戳是毫秒级的 Unix 时间戳
        user.createTime = timestampToString(user.createTime);
        // const lastLoginTime = new Date(parseInt(user.lastLoginTime)).toISOString().split('T')[0];
        // 更新用户对象中的时间戳字段为日期字符串
        user.lastLoginTime = user.lastLoginTime ? timestampToString(user.lastLoginTime) : null;
        user.updateTime = timestampToString(user.updateTime);
        // 处理是否为CA用户
        user.role = user.isCA === 0 ? '普通用户' :
            user.isCA === 1 ? '审计员' :
                user.isCA === 2 ? '管理员' :
                    '未知';
        // 处理用户状态
        user.status = user.status === 0 ? '正常' : user.status === 1 ? '封禁' : '未知';
      });
      // 添加到数据
      tableData.value = data;

    } else {
      errorMsg("数据不存在")
      router.push("/login")
    }

  } catch (error) {
    errorMsg(error.response.data.status_msg)
  }

};

// 使用 onMounted 钩子在组件挂载后调用函数
onMounted(() => {
  getUsersInfo();
});
const handleClick = async (row) => {
  if (row.status === '正常') {
    // 执行Ban的逻辑
    Ban(row.Id)
  } else if (row.status === '封禁') {
    // 执行UnBan的逻辑
    UnBan(row.Id)
  }

}

// 封禁用户
async function Ban(id) {
  try {
    let formData = new FormData;
    formData.append("id", id)
    const response = await BanUser(formData)
    if (response.status == 200) {
      SuccessMsg("success")
      // 刷新页面
      getUsersInfo()
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    errorMsg(error)
  }
}

async function UnBan(id) {
  try {
    let formData = new FormData;
    formData.append("id", id)
    const response = await UnBanUser(formData)
    if (response.status == 200) {
      SuccessMsg("success")
      // 刷新页面
      getUsersInfo()
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    errorMsg(error)
  }
}

async function upgrade(id) {
  try {
    let formData = new FormData;
    formData.append("id", id)
    const response = await UpgradeUser(formData)
    if (response.status == 200) {
      SuccessMsg("success")
      // 刷新页面
      getUsersInfo()
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    errorMsg(error)
  }
}

async function degrade(id) {
  try {
    let formData = new FormData;
    formData.append("id", id)
    const response = await DegradeUser(formData)
    if (response.status == 200) {
      SuccessMsg("success")
      // 刷新页面
      getUsersInfo()
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    errorMsg(error)
  }
}

// 查看详细的密钥
const keyDetail = (data) => {
  centerDialogVisible.value = true
  dialogContent.value = data
}

const deleteUser =  (id) => {
  dialogVisible.value = true
  confirmCertId.value = id
}
async function ConfirmDelete() {
  try {
    const response = await DeleteUser(confirmCertId.value)
    if (response.status == 200) {
      SuccessMsg("success")
      // 刷新页面
      getUsersInfo()
    } else {
      errorMsg(response.data)
    }
  } catch (error) {
    errorMsg(error)
  }
}

const errorMsg = (msg) => {
  ElMessage({
    message: msg,
    type: "error",
    // duration: 0,
    showClose: true,
    grouping: true
  })
}

const SuccessMsg = (msg) => {
  ElMessage({
    message: msg,
    type: 'success',
  })
}

const open = () => {
  ElMessageBox.confirm(
      'proxy will permanently delete the file. Continue?',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
}

function timestampToString(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0'); // 用0填充
  const min = String(date.getMinutes()).padStart(2, '0'); // 用0填充
  return `${year}-${month}-${day} ${hour}:${min}`;
}
</script>
