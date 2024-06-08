<template>
    <el-container class="content" direction="vertical">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home ms-1"></i>首頁</el-breadcrumb-item>
            <el-breadcrumb-item>待辦事項</el-breadcrumb-item>
        </el-breadcrumb>
        <el-main class="content-area">
            <el-row>
                <el-col :span="14" :offset="5">
                    <el-form :inline="true">
                        <el-form-item>
                            <el-input style="width: 300px;" v-model="newTitle" placeholder="請輸入待辦事項內容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="medium" round @click="createTodo">新增</el-button>
                            <el-button type="info" size="medium" round @click="resetInput">清除</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16" :offset="4">
                    <el-divider></el-divider>
                </el-col>
            </el-row>
            <el-row id="list-container">
                <el-col :span="16" :offset="4">
                    <template v-for="(todo, index) in todos" v-show="!isEmpty">
                        <el-row>
                            <el-col :span="2" class="text-center">
                                <el-checkbox v-model="todo.done" @change="as_updateTodoItemState(todo._id, todo.done)"></el-checkbox>
                            </el-col>
                            <el-col :span="18">
                                <p :class="{ 'text-decoration-line-through': todo.done }">{{ todo.title }}</p>
                            </el-col>
                            <el-col :span="4" class="text-center">
                                <el-tooltip class="item" effect="dark" placement="left-start">
                                    <div slot="content">刪除</div>
                                    <el-button type="danger" size="small" circle icon="el-icon-delete" @click="removeTodoItem(index)"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" placement="right-start">
                                    <div slot="content">檢視</div>
                                    <el-button type="info" size="small" circle icon="el-icon-view" @click="readTodo(index)"></el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                        <el-divider></el-divider>
                    </template>
                    <p v-show="isEmpty">無待辦事項!!</p>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" :offset="4">
                    <el-pagination class="text-center"
                        layout="prev, pager, next"
                        :page-size="pageSize"
                        :total="todoTotal"
                        @current-change="pageChange"
                        >
                    </el-pagination>
                </el-col>
                <el-col :span="6">
                        總待辦事項，共 {{ todoTotal }} 項
                </el-col>
            </el-row>
        </el-main>
        <MemoWindow @addTodo="addTodoItem" @updateTodo="updateTodoItem"></MemoWindow>
        <div v-show="open" id="mask"></div>
    </el-container>
</template>
<script>
import MemoWindow from '../components/MemoWindow.vue';
import { useTodoStore } from '../stores/todo';
import { useGlobalStore } from '../stores/global';
import { mapWritableState, mapState, mapActions } from 'pinia';



export default {
    components: {
        MemoWindow
    },
    data() {
        return {
            newTitle: '',
            readIndex: -1,
            pageSize: 6
        }
    },
    computed: {
        isEmpty() {
            return this.todos.length === 0;
        },
        ...mapState(useTodoStore, ['open', 'todos','todoTotal']),
        ...mapWritableState(useTodoStore,['title', 'memo']),
        ...mapWritableState(useGlobalStore, ['isLogin'])
    },
    methods: {
        resetInput() {
            this.newTitle = '';
        },
        createTodo() {
            if (this.newTitle === '') {
                return this.$alert("請輸入待辦內容", '訊息', 
                {   type: 'warning',
                    showClose: false,
                    confirmButtonText: '確認' 
                });
            }
            this.title = this.newTitle;
            this.memo = '';
            this.toggleWindow('add');
        },
        readTodo(index) {
            this.readIndex = index;
            const { title, memo } = this.todos[index];
            this.title = title;
            this.memo = memo;
            this.toggleWindow('read');
        },
        // 新增待辦事項處理
        async addTodoItem(data) {
            try {
                await this.as_addTodoItem(data);
                
                this.todos.unshift(data);
                this.openWindowMode = 'read';
                this.newTitle = '';
                this.reset();

                this.$alert('新增成功', '訊息', {
                    type: 'success',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            } catch (error) {
                this.$alert(`新增失敗!原因: ${error.message}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            }
        },
        async updateTodoItem(data) {
            try {
                const _id = this.todos[this.readIndex]._id;

                const updateData = {
                    title: data.title,
                    memo: data.memo
                };

                console.log(this.readIndex, _id, updateData);
                await this.as_updateTodoItem(_id, updateData);

                this.todos[this.readIndex].title = data.title;
                this.todos[this.readIndex].memo = data.memo;

                this.$alert('更新成功', '訊息', {
                    type: 'success',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            } catch (error) {
                this.$alert(`更新失敗!原因: ${error.message}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            }
        },
        async removeTodoItem(index) {
            try {
                const _id = this.todos[index]._id;

                this.as_removeTodoItem(_id);
                this.todos.splice(index, 1);

                this.$alert('刪除成功', '訊息', {
                    type: 'success',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            } catch (error) {
                this.$alert(`刪除失敗!原因: ${error.message}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            }
        },
        async pageChange(page) {
            await this.loadData(page, this.pageSize);
        },
        ...mapActions(useTodoStore, ['toggleWindow', 'reset', 'loadData', 
            'as_addTodoItem','as_updateTodoItem','as_removeTodoItem', 'as_updateTodoItemState'])
    },
    async beforeMount() {
        try {
            await this.loadData(1, this.pageSize);
        } catch (error) {
            alert(error.message);
        }
    },
}
</script>

<style scoped>
.el-form {
    padding: 5px;
}
.el-form-item {
    margin: 5px;
}
.el-row {
    width: 100%;
}
.el-divider--horizontal {
    margin-top: 0px;
    margin-bottom: 10px;
}

#list-container .el-divider--horizontal {
    margin-top: 2px;
    margin-bottom: 2px;
}

#list-container .el-row {
    padding: 5px 0px;
}

#list-container .el-row:hover {
    background-color:  rgb(225, 243, 216);
}

#list-container p {
    margin: 0px;
    font-size: 18px;
    padding: 5px 10px;
}

#list-container .el-col p {
    margin: 0px;
    font-size: 1.05rem;
    padding: 0px 10px 10px;
}

/* 編輯window樣式 */
#memo-edit-window {
  position: absolute;
  left: 25%;
  top: 22%;
  z-index: 6;
}
/* 備註編輯window背景遮罩 */
#mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
}
</style>