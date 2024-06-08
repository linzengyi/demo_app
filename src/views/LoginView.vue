<template>
  <el-container class="content" direction="vertical">
    <el-col style="height: 100vh;" :span="8" :offset="15">
      <div id="loginFrame">
        <el-header height="45px"></el-header>
        <el-main id="content-area">
          <el-form :model="loginForm"  label-width="80px" label-position="right" label-suffix=":" @submit.native.prevent>
            <el-form-item label="登入身份">
              <el-select v-model="loginForm.identity" @change="identityChangeHandler">
                <el-option label="訪客" value="visitor"></el-option>
                <el-option label="開發者" value="developer"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="帳號">
              <el-input placeholder="請輸入帳號" v-model="loginForm.account"></el-input>
              <small class="fs-6">*帳號為email</small>
            </el-form-item>
            <el-form-item label="密碼">
              <el-input show-password placeholder="請輸入密碼" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round @click="submit">登入</el-button>
              <el-button class="me-2" round @click="reset">清除</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </div>
    </el-col>
  </el-container>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { useGlobalStore } from '../stores/global'
import { login, hasLogin } from '../lib/api/auth';



export default {
  data() {
    return {
      loginForm: {
        identity: 'visitor',
        account: 'demo@gmail.com',
        password: '123456'
      }
    }
  },
  computed: {
    ...mapState(useGlobalStore, ['isLogin'])
  },
  methods: {
    identityChangeHandler(value) {
      if (value === 'visitor') {
        this.loginForm.account = 'demo@gmail.com';
        this.loginForm.password = '123456';
      } else {
        this.loginForm.account = '';
        this.loginForm.password = '';
      }
    },
    reset() {
      if (this.loginForm.identity === 'visitor') {
        this.loginForm.account = 'demo@gmail.com';
        this.loginForm.password = '123456';
      } else {
        this.loginForm.account = '';
        this.loginForm.password = '';
      }
    },
    async submit() {
      const res = await login(this.loginForm);

      if (res.success) {
        this.updateUserInfo(res.identity);
        this.toggleLogin();
        this.$router.push({ path: '/' });
      } else {
        this.$alert(`登入失敗!原因: ${res.msg}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
      }
    },
    mounted() {
      if (hasLogin() && !this.isLogin) {
        this.toggleLogin();

        if (this.$route.path === '/login') {
          this.$router.push({ path: '/' });
        }
      }
    },
    ...mapActions(useGlobalStore, ['toggleLogin', 'updateUserInfo'])
  }
}

</script>

<style scoped>
#loginFrame {
  width: 400px;
  position: absolute;
  top: 20%;
  right: 80%;
}

@media screen and (min-width: 1280px) {
  #loginFrame {
    right: 380px;
  }
}
.el-header {
  background-color: rgb(179, 216, 255);
}

#content-area {
  padding: 10px;
  background-color: white;
}

.el-form {
  padding: 10px;
}

.el-form-item {
  margin-bottom: 12px;
}

.el-form-item:nth-child(2n+2) {
  margin-bottom: 0px;
}

.el-form-item:last-child {
  text-align: right;
}

</style>
