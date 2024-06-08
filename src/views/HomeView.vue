<template>
  <el-container class="content" direction="vertical">
    <el-col :span="24">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><i class="el-icon-s-home ms-1"></i>首頁</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24">
      <el-main class="content-area ">
        <el-card class="ms-4 mt-4" shadow="hover" :body-style="cardBodyStyle">
          <div slot="header" class="clearfix">
            <span>待辦事項(未完成)，共 {{ todo.totolCount }} 項</span>
          </div>
          <template v-if="todo.totolCount > 0">
            <div v-for="todo in todo.list" :key="todo._id" class="text item">
              {{ todo.title }}
            </div>
            <el-row>
              <el-col :span="24">
                  <el-pagination class="text-center"
                      layout="prev, pager, next"
                      :page-size="todoPageSize"
                      :total="todo.totolCount"
                      @current-change="pageChange"
                      >
                  </el-pagination>
              </el-col>
            </el-row>
          </template>
        </el-card>
      </el-main>
    </el-col>    
  </el-container>
</template>

<script>
import { mapState } from 'pinia';

import { useGlobalStore } from '../stores/global';
import { getUnfinshTodo } from '../lib/api/todo';



export default {
  data() {
    return {
      todo: {
        list: [],
        totolCount: 0
      },
      todoPageSize: 6
    }
  },
  computed: {
    cardBodyStyle() {
      return {
        padding: '8px 15px',
        backgroundColor: 'rgb(244, 244, 245)'
      }
    },
    ...mapState(useGlobalStore, ['isLogin'])
  },
  methods: {
    async pageChange(page) {
      const todoData = await getUnfinshTodo(page, this.todoPageSize);
      this.todo.list.splice(0, this.todo.list.length, ...todoData.docs);
      this.todo.totolCount = todoData.totalDocs;
    },
  },
  async beforeMount() {
    const todoData = await getUnfinshTodo(1, this.todoPageSize);

    this.todo.list.splice(0, this.todo.list.length, ...todoData.docs);
    this.todo.totolCount = todoData.totalDocs;
  },
  mounted() {
    if (!this.isLogin) {
      this.$router.push({ path: '/login' });
    }
  }
}

</script>

<style scoped>
  .el-card {
    float: left;
    margin-left: 30px;
    width: 360px;
  }

  :deep(.el-card__header) {
    background-color: #4bbe3c;
    padding: 10px;
    font-size: 1.2rem;
    color: #f8f8f8;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 10px;
    padding: 0px 0px 5px;
    padding-left: 10px;
    border-bottom: 1px solid #E4E7ED;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
