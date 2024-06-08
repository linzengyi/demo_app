<template>
  <div id="app">
    <el-container>
      <el-aside id="aside-menu" v-show="isLogin">
        <el-container direction="vertical" id="menu">
            <el-header>
              <h2>
                <i class="el-icon-menu"></i> 功能選單
              </h2>
            </el-header>
            <el-main>
              <el-menu @select="handleSelect">
                <el-menu-item index="1">
                  <i class="el-icon-menu"></i>
                  <span slot="title">
                    待辦事項
                  </span>
                </el-menu-item>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">
                    記帳本
                  </span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-menu"></i>
                  <span slot="title">
                    關於
                  </span>
                </el-menu-item>
              </el-menu>
            </el-main>
        </el-container>
      </el-aside>
      <el-container direction="vertical" id="content-area">
        <el-header id="main-header">
          <el-row>
            <el-col :span="24">
              <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="45" height="45" />
              <h1 class="text-light fw-bold fs-3">範例應用</h1>
              <span id="userInfo" class="text-white" v-show="isLogin"><i class="el-icon-user me-1 fw-bold "></i>{{ user.name }}</span>
              <el-button size="small" @click="logout" v-show="isLogin">登出</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main class="bg-light" id="main-body">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import { mapWritableState, mapActions, mapState } from 'pinia';

import { useGlobalStore } from './stores/global';
import { hasLogin, logout } from './lib/api/auth';

export default {
  components: { },
  data() {
    return {
      collapse: true
    }
  },
  computed: {
    ...mapState(useGlobalStore, ['user']),
    ...mapWritableState(useGlobalStore, ['isLogin'])
  },
  methods: {
    handleSelect(index) {
      switch(parseInt(index)) {
        case 1:
          this.$router.replace({ path: '/todo' });
          break;
        case 2:
          this.$router.replace({ path: '/acount' });
          break;
        case 3:
          this.$router.replace({ path: '/about' });
          break;
        default:
          this.$router.replace({ path: '/' });
          break;
      }
    },
    async logout() {
      const data = localStorage.getItem('liveApp');
      if (!data) {
          const result = await this.$alert(`尚未登入!`, '訊息', {
                    type: 'info',
                    showClose: false,
                    confirmButtonText: '確認'
                });

          if (result === 'confirm') {
            this.$router.push({ path: '/login' });
          }
      } else {
        const { token } = JSON.parse(data);
        const res = await logout(token);

        if (res.success) {
          this.toggleLogin();
          this.$router.push({ path: '/login' });
        } else {
          this.$alert(`登出失敗!原因: ${res.msg}`, '訊息', {
                      type: 'error',
                      showClose: false,
                      confirmButtonText: '確認'
                  });
        }
      }
    },
    ...mapActions(useGlobalStore, ['toggleLogin', 'updateUserInfo'])
  },
  mounted() {
    if (hasLogin()) {
      const data = localStorage.getItem('liveApp');
      const { identity } = JSON.parse(data);
      this.updateUserInfo(identity);
      this.toggleLogin();
      if (this.$route.path === '/login') {
        this.$router.push({ path: '/' });
      }
    }

    if (!this.isLogin && this.$route.path !== '/login') {
      this.$router.push({ path: '/login' });
    }
  }
}
</script>

<style scoped>
/* 左側menu區塊樣式設定 */
#aside-menu {
  border-right: 2px solid #DCDFE6;
  background-color: rgb(233,233,235);
}

#menu header {
  padding: 0;
  border-right: 2px solid #DCDFE6;
  background-color: rgb(102, 177, 255);
}

#menu header h2 {
  display: inline-block;
  box-sizing: border-box;
  width: 250px;
  font-size: 1.33rem;
  font-weight: bold;
  line-height: 2.5;
  padding: 5px 0px;
  padding-left: 15px;
  color: #FFFFFF;
}

#menu .el-main {
  padding: 1px;
  background-color: rgb(233,233,235);
}

/* 右側區塊樣式設定 */
#content-area {
  height: 98vh;
}

/* 右側header樣式設定 */
#main-header {
  background-color: #409EFF;
}

#main-header > .el-row {
  height: 60px;
  padding: 5px;
}

#main-header > .el-row .el-col {
  height: 50px;
}

#main-header > .el-row img {
  margin-bottom: 8px;
}

#main-header > .el-row #userInfo {
  display: inline-block;
  width: 100px;
  height: 50px;
  font-size: 1.25rem;
  line-height: 50px;
  position: absolute;
  right: 45px;
}

#main-header > .el-row h1 {
  display: inline-block;
  height: 50px;
  margin: 0px 10px;
  line-height: 1.7;  
}

#main-header > .el-row button {
  position: absolute;
  top: 9px;
  right: 0px;
}

/* view內容樣式設定 */
#main-body {
  padding: 15px 15px;
  padding-top: 0px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* bred元件樣式設定 */
:deep(.el-breadcrumb) {
  margin: 0px;
  padding: 10px;
}

:deep(.content) {
  padding: 5px;
  height: 100%;
}

</style>
