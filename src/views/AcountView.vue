<template>
    <el-container class="content" direction="vertical">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home ms-1"></i>首頁</el-breadcrumb-item>
            <el-breadcrumb-item>記帳本</el-breadcrumb-item>
        </el-breadcrumb>
        <el-main class="content-area">
            <div id="content-box" class="container container-xl mt-2">
                <div class="row py-1">
                    <div class="col-10">
                        <div class="row" id="queryRuleBar">
                            <div class="col-1 pe-0">
                                <el-tooltip placement="top-start">
                                    <div slot="content">{{ openQueryBar ? '取消' : '查詢' }}</div>
                                    <i class="p-2 m-1" :class="{ 'el-icon-search': !openQueryBar, 'el-icon-close': openQueryBar  }" @click="toggleQueryBar"></i>
                                </el-tooltip>
                            </div>
                            <div class="col-6 ps-0">
                                <div id="queryRuleContent" class="d-flex animate__animated" :class="{ animate__fadeOutLeft: !openQueryBar, animate__fadeInLeft: openQueryBar  }" >
                                    <label class="col-form-label m-1" for="year">年</label>
                                    <select class="form-select" id="year" v-model="queryDate.year" @change="changeYearOrMonth">
                                        <template v-for="i in 2">
                                            <option :value="i === 2 ? currentYear - 1 : currentYear">{{ i === 2 ? currentYear - 1 : currentYear }}</option>
                                        </template>
                                    </select>
                                    <label class="col-form-label m-1" for="month">月</label>
                                    <select class="form-select" id="month" v-model="queryDate.month" @change="changeYearOrMonth">
                                        <option v-for="i in 12" :value="i.toString().padStart(2,'0')">{{ i.toString().padStart(2,'0') }}</option>
                                    </select>
                                    <button class="btn btn-sm btn-success ms-2 pe-3" @click="reset">
                                        <i class="el-icon-refresh p-1"></i>重置
                                    </button>
                                    <el-tooltip placement="top">
                                        <div slot="content">指定年、月欄位<br/>自動查詢指定該年月記帳明細</div>
                                        <i class="el-icon-info p-2 m-1"></i>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-2 pe-4 text-end">    
                        <a class="btn btn-primary" @click.passive="toggleWindow('add')">新增</a>
                    </div>
                </div>
                <hr class="my-1">
                <p class="mb-0 p-1 px-2 text-end fs-6">符號: <i class="el-icon-tickets"></i> 檢視備註內容</p>
                <template v-for="item in list">
                    <div class="card mb-2">
                        <div class="card-header bg-opacity-25" :class="{ 'bg-danger': isExpenses(item.type), 'bg-success': !isExpenses(item.type) }">
                            <span class="p-1 fs-5 fw-bolder">{{ formatDateToString(item.incomeAndExpenditureDate) }}</span>
                        </div>
                        <div class="card-body shadow-sm">
                            <div class="row">
                                <div class="col-7">
                                    <p class="my-1 fs-5">{{ item.title }}</p>
                                </div>
                                <div class="col-2">
                                    <!-- <template v-if="item.memo != ''"> -->
                                        <el-tooltip placement="top-end" :class="{ invisible: item.memo === '' }">
                                            <div slot="content">備註</div>
                                            <i class="el-icon-tickets fs-3 memo" @click="showMemo(item.memo)"></i>
                                        </el-tooltip>
                                    <!-- </template> -->
                                    <span class="expenses-text fs-4 fw-bold bg-opacity-75" 
                                    :class="{ 'bg-warning': isExpenses(item.type), 'bg-success': !isExpenses(item.type) }"
                                    >{{ formateTypeToName(item.type) }}</span>
                                </div>
                                <div class="col-2">
                                    <span class="p-1 fs-5">{{ item.amount }} 元</span>
                                </div>
                                <div class="col-1">
                                    <button type="button" class="btn-close" aria-label="Close" @click="removeData(item._id)"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                 <div id="pagination-area" class="row mt-4">
                    <div class="col-12">
                        <el-pagination class="text-center"
                        layout="prev, pager, next"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :total="acountTotal"
                        @current-change="pageChange"
                        >
                        </el-pagination>
                    </div>
                 </div>
            </div>
        </el-main>
        <AcountWindow v-show="open" @reload="reset"/>
    </el-container>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { format, getMonth, getYear } from 'date-fns';

import AccountWindow from '../components/AcountWindow.vue';
import { useAcountStore } from '../stores/acount.js';

import { loadData, deleteData } from '../lib/api/acount.js';

export default {
    data() {
        const d = new Date();

        return {
            list: [],
            pageSize: 4,
            acountTotal: 1,
            queryDate: {
                year: getYear(d).toString(),
                month: (getMonth(d) + 1).toString().padStart(2,'0')
            },
            currentPage: 1,
            openQueryBar: false 
        };
    },
    components: {
        AccountWindow
    },
    computed: {
        currentYear() {
            return getYear(new Date());
        },
        currentMonth() {
            const month = getMonth(new Date()) + 1;
            return month.toString().padStart(2,'0')
        },
        ...mapState(useAcountStore, ['open'])
    },
    methods: {
        async loadData(page=1, limit=4, options) {
            const { docs, totalDocs } = await loadData(page, limit, options);
            
            this.acountTotal = totalDocs;
            this.list.splice(0, this.list.length, ...docs);
        },
        async removeData(id) {
            try {
                const confirm = await this.$confirm('確認是否刪除?', '提示', {
                    confirmButtonText: '確認',
                    cancelButtonText: '取消',
                    type: 'warning'
                });

                if (confirm) {
                    const response = await deleteData(id);

                    if (response.success) {
                        await this.loadData();
                    } else {
                        this.$alert(`刪除失敗!原因: ${response.msg}`, '訊息', {
                            type: 'error',
                            showClose: false,
                            confirmButtonText: '確認'
                        });
                    }
                }
            } catch(error) {
                if (typeof error == 'string' && error === 'cancel') {
                    return;
                }
                this.$alert(`刪除失敗!原因: ${error.message}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            }
        },
        async pageChange(page) {
            const { year, month } = this.queryDate;
            const options = {
                date: `${year}-${month}`
            };

            await this.loadData(page, this.pageSize, options);
        },
        async changeYearOrMonth() {
            const { year, month } = this.queryDate;
            const options = {
                date: `${year}-${month}`
            };

            this.currentPage = 1;

            await this.loadData(1, this.pageSize, options);
        },
        async reset() {
            this.queryDate.year = this.currentYear;
            this.queryDate.month = this.currentMonth;
            this.currentPage = 1;
            await this.loadData(1, this.pageSize);
        },
        toggleQueryBar() {
            this.openQueryBar = !this.openQueryBar;
        },
        showMemo(momo) {
            this.$alert(`${momo}`, '備註', {
                            type: 'info',
                            showClose: false,
                            confirmButtonText: '確認'
                        });
        },
        formateTypeToName(type) {
            return parseInt(type) === 1 ? '收入' : '支出'
        },
        formatDateToString(date) {
            return format(date, 'yyyy-MM-dd');
        },
        isExpenses(type) {
            return parseInt(type) < 0 ? true : false;
        },
        ...mapActions(useAcountStore, ['toggleWindow'])
    },
    async beforeMount() {
        await this.loadData(1, this.pageSize);
    }
}
</script>

<style scoped>
#queryRuleBar i {
    border-right: 1px solid #727272;
    font-size: 18px;
}

#queryRuleBar .el-icon-search,
#queryRuleBar .el-icon-close {
    cursor: pointer;
    z-index: 100;
}
#queryRuleBar .el-icon-search:hover,
#queryRuleBar .el-icon-close:hover {
    border-radius: 5px;
    border: 1px solid #DCDFE6;
    color: #409EFF;
    font-weight: bold;
}



#queryRuleBar .el-icon-refresh {
    border-right-width: 0px;
    font-size: 16px;
}

#queryRuleBar .el-icon-info {
    border-right-width: 0px;
    font-size: 20px;
}

#queryRuleBar .el-icon-info:hover {
    color: #409EFF;
}

#queryRuleBar select {
    width: 90px;
}

.expenses-text {
    display: inline-block;
    height: 42px;
    line-height: 42px;
    padding: 1px 5px;
}

.memo {
    width: 38px;
    height: 43px;
    line-height: 40px;
    box-sizing: border-box;
    cursor: pointer;
    text-align: center;
}

.memo:hover {
    color: #409EFF;
    border: 1px solid #E4E7ED;
}

button[aria-label="Close"] {
    opacity: 0;
    width: 50px;
    height: 30px;
}
button[aria-label="Close"]:hover {
    opacity: 0.8;
}

#pagination-area {
    padding: 15px 0px 15px;
}



</style>