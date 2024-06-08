<template>
    <div id="accountEditWindow" class="container mt-3 p-3">
        <form action="" class="mt-4 px-5 py-3" @submit.prevent>
            <div class="row bg-primary">
                <div class="col-10 pt-1">
                    <h1 class="h2 text-white">新增紀錄</h1>
                </div>
                <div class="col-2 text-center">
                    <button type="button" class="btn-close" aria-label="Close" @click="toggleWindow('')"></button>
                </div>
            </div>
            <div id="edit-area" class="container">
                <div class="row mb-2">
                    <div class="col-12 fw-bolder">事項</div>
                    <div class="col-12">
                        <input class="form-control" type="text" v-model.trim="form.title">
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12 fw-bolder">日期</div>
                    <div class="col-12">
                        <input class="form-control" type="datetime-local" v-model="form.incomeAndExpenditureDate">
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12 fw-bolder">類型</div>
                    <div class="col-12">
                        <select class="form-select" v-model.number="form.type">
                            <option value="-1">支出</option>
                            <option value="1">收入</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12 fw-bolder">金額</div>
                    <div class="col-12">
                        <input class="form-control" type="number" v-model.number="form.amount">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12 fw-bolder">備註</div>
                    <div class="col-12">
                        <textarea class="form-control" cols="30" rows="3" v-model.trim="form.memo"></textarea>
                    </div>
                </div>
                <button class="btn btn-primary w-100" @click="create">新增</button>
            </div>
            
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';

import { useAcountStore } from '../stores/acount.js';
import { createData } from '../lib/api/acount.js';

export default {
    computed: {
        ...mapState(useAcountStore, ['open', 'form'])
    },
    methods: {
        async create() {
            try {
                const response = await createData(this.form);

                if (response.success) {
                    const ok = await this.$alert('新增成功', '訊息', {
                        type: 'success',
                        showClose: false,
                        confirmButtonText: '確認'
                    });
                    if (ok === 'confirm') {
                        this.resetFormData();
                        this.toggleWindow('');
                        this.$emit('reload');
                    }
                } else {
                    this.$alert(`新增失敗!原因: ${response.msg}`, '訊息', {
                        type: 'error',
                        showClose: false,
                        confirmButtonText: '確認'
                    });
                }
            } catch (error) {
                this.$alert(`新增失敗!原因: ${error.message}`, '訊息', {
                    type: 'error',
                    showClose: false,
                    confirmButtonText: '確認'
                });
            }
        },
        ...mapActions(useAcountStore, ['toggleWindow','resetFormData'])
    }
}
</script>

<style scoped>
#accountEditWindow {
    position: absolute;
    top: -15px;
    right: -15px;
    bottom: -15px;
    left: -15px;
    background-color: rgba(10, 10, 10, 0.8);
}

.btn-close:hover {
    color: #fff;
}

#accountEditWindow > form {
    position: relative;
    background-color: #fff;
    width: 550px;
    margin-left: auto;
    margin-right: auto;
}

#accountEditWindow > form > .row {
    position: absolute;
    top: 0px;
    left: 12px;
    width: 100%;
    box-sizing: border-box;
}

#accountEditWindow > form > .row .col-2 {
    line-height: 50px;
}

#edit-area {
    margin-top: 45px;
}
</style>