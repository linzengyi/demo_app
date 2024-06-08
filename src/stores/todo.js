import { defineStore } from 'pinia';
import axios from 'axios';


export const useTodoStore = defineStore({
  id: 'todo',
  state: () => ({
    open: false,
    mode: 'read', // 值: read、edit、add
    title: '',  // 正式待辦事項
    memo: '',   // 正式待辦備註
    todos: [],
    todoTotal: 0
  }),
  getters: {
    isShow: (state) => state.open
  },
  actions: {
    toggleWindow(mode) {
      this.open = !this.open;
      this.mode = mode;
    },
    reset() {
        this.title = '';
        this.memo = '';
    },
    async loadData(page=1, limit=6) {
      const { data: result} = await axios.get(`${import.meta.env.VITE_API_DOMAIN}/todos?page=${page}&limit=${limit}`);
      this.todos.splice(0, this.todos.length, ...result.docs);
      this.todoTotal = result.totalDocs;
    },
    async as_addTodoItem(data) {
      console.log('---- 呼叫新增api ----');
      const result = await axios.post(`${import.meta.env.VITE_API_DOMAIN}/todos`, data);
      console.log(result);
    },
    async as_updateTodoItem(id, data) {
      console.log('呼叫修改api');
      const result = await axios.put(`${import.meta.env.VITE_API_DOMAIN}/todos/${id}`, data);
      console.log(result);
    },
    async as_removeTodoItem(id) {
      console.log('呼叫刪除api');
      const { data: result} = await axios.delete(`${import.meta.env.VITE_API_DOMAIN}/todos/${id}`);
      return result;
    },
    async as_updateTodoItemState(id, state) {
      const updateData = {
        updateDoneState: state
      };

      console.log('呼叫修改狀態api');
      const result = await axios.put(`${import.meta.env.VITE_API_DOMAIN}/todos/${id}/state`, updateData);
      console.log(result);
    }
  }
})
