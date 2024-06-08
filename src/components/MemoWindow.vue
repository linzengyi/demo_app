<template>
<div id="memo-edit-window" class="window-container" v-show="isShow">
    <el-container direction="vertical">
        <el-header>
            <h2>待辦事項</h2>
        </el-header>
        <el-main>
            <el-form label-width="60px" label-suffix=":">
                <template v-if="mode === 'edit'">
                    <el-form-item label="內容">
                        <el-input v-model="edit_title"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="內容">
                        <el-input v-model="title" :disabled="true"></el-input>
                    </el-form-item>
                </template>
                <template v-if="mode === 'edit' || mode === 'add'" >
                    <el-form-item label="備註">
                        <el-input type="textarea" rows="3" maxlength="50" placeholder="輸入該待辦事項需備註內容(非必填)" show-word-limit v-model="edit_memo"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="備註">
                        <el-input type="textarea" rows="3" :disabled="true" v-model="memo"></el-input>
                    </el-form-item>
                </template>
                <small>內容限50個字</small>
            </el-form>
        </el-main>
        <el-footer height="45px">
            <el-button  size="medium" round v-show="mode === 'add' || mode === 'read'" @click="closeWindow">關閉</el-button>
            <el-button type="success" size="medium" round v-show="mode === 'read' || mode === 'edit'" @click="editToogle()">{{ editBtnText }}</el-button>
            <el-button type="primary" size="medium" round v-show="mode === 'add' || mode === 'edit'" @click="save()">確認</el-button>
        </el-footer>
    </el-container>   
</div>
</template>

<script>
import { useTodoStore } from '../stores/todo';
import { mapWritableState, mapState, mapActions } from 'pinia';

export default {
    data() {
        return {
            edit_title: '',
            edit_memo: ''
        }
    },
    computed: {
        ...mapState(useTodoStore, ['open']),
        ...mapWritableState(useTodoStore,['title', 'memo', 'mode']),
        isShow() {
            return this.open;
        },
        editBtnText() {
            return this.mode === 'read' ? '編輯' : '取消編輯';
        },
    },
    methods: {
        closeWindow() {
            this.toggleWindow('read');
            if (this.mode === 'add') {
                this.edit_memo = '';
                this.memo = '';
            }
        },
        async save() {
            const data = {
                title: this.title,
                memo: this.edit_memo,
                done: false
            };

            if (this.mode === 'add') {
                this.$emit('addTodo', data);
            } else {
                data.title = this.edit_title;
                data.memo = this.edit_memo;
                this.$emit('updateTodo', data);
            }
            this.toggleWindow('read');
        },
        editToogle() {
            if (this.mode === 'read') {
                this.mode = 'edit';
                this.edit_title = this.title;
                this.edit_memo = this.memo; 
            } else {
                this.mode = 'read';
            }
        },
        ...mapActions(useTodoStore, ['toggleWindow'])
    }
};
</script>
<style scoped>
    .window-container {
        width: 450px;
        height: 275px;
        background-color: rgb(244, 247, 247);
    }

    header {
        padding: 5px 10px;
        background-color: rgb(83, 168, 255);
    }
    header > h2 {
        font-size: 1.25rem;
        font-weight: bold;
        margin-top: 9px;
        margin-top: 9px;
        color: var(--vt-c-white);
    }
    

    main {
        padding: 10px 12px;
        padding-bottom: 0px;
    }

    main .el-form-item {
        margin-bottom: 10px;
    }

    footer {
        text-align: right;
        background-color: rgb(233, 233, 235);
    }

    footer button {
        margin-top: 5px;
    }
     /*

    .window-container > header {
        width: 100%;
        height: 50px;
        background-color: #ad8acd;
    }

    .window-container > header h1 {
        font-size: 18px;
        padding: 0px 10px;
        color: rgb(62, 65, 65);
        line-height: 50px;
    }

    .window-container > main {
        width: 100%;
        height: 210px;
        margin: 0;
        padding: 5px;
    }

    .window-container > main p {
        padding: 5px;
    }
    .window-container > main p#titleContent {
        padding-left: 10px;
    }

    .window-container > footer {
        width: 100%;
        height: 30px;
        text-align: right;
        padding: 10px 5px;
    }

    .window-container > footer button {
        margin-left: 10px;
    }
    #edit-area {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    #edit-area textarea {
        width: 430px;
        height: 100px;
        border: 2px solid rgb(156, 162, 167);
        font-size: 16px;
    }
    */
</style>