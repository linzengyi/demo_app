import { defineStore } from 'pinia'

export const useGlobalStore = defineStore({
  id: 'global',
  state: () => ({
    isLogin: false,
    user: {
      name: '訪客'
    }
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    toggleLogin() {
      this.isLogin = !this.isLogin;
    },
    updateUserInfo(identity) {
      if (identity === 'visitor') {
        this.user.name = '訪客';
      } else {
        this.user.name = '開發者';
      }
    }
  }
})
