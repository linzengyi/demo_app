import { defineStore } from 'pinia'

export const useAcountStore = defineStore({
  id: 'acount',
  state: () => ({
    open: false,
    mode: '', // 模式: add(新增)、edit(編輯)、''
    form: {
      title: '',
      incomeAndExpenditureDate: '',
      type: -1, // 值: -1(支出)、1(收入)
      amount: 0,
      memo: ''
    }
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    toggleWindow(mode) {
      this.open = !this.open;
      this.mode = mode;
    },
    resetFormData() {
      this.form.title = '';
      this.form.incomeAndExpenditureDate = '';
      this.form.type = -1;
      this.form.amount = 0;
      this.form.memo = '';
      
    }
  }
})
