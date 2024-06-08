<template>
  <el-container class="content" direction="vertical">
    <el-col :span="24">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path: '/' }"><i class="el-icon-s-home ms-1"></i>首頁</el-breadcrumb-item>
        <el-breadcrumb-item>關於</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24">
      <el-main class="content-area">
        <h1 class="text-center mt-5">開發技術</h1>
        <div class="info-block">
          <table id="table1" class="table table-bordered caption-top align-middle">
            <caption class="fs-4 text-center">前端</caption>
            <colgroup id="itemCol"></colgroup>
            <colgroup id="contentCol"></colgroup>
            <thead>
              <tr>
                <th scope="col" class="text-center">項目</th>
                <th scope="col">內容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="text-center" scope="row">JS框架:</th>
                <td>vue、axios</td>
              </tr>
              <tr>
                <th class="text-center" scope="row">CSS框架:</th>
                <td>Bootstrap5</td>
              </tr>
              <tr>
                <th class="text-center" scope="row">UI框架:</th>
                <td>Element UI</td>
              </tr>
              </tbody>
          </table>
          <table id="table2" class="table table-bordered caption-top align-middle">
            <caption class="fs-4 text-center">後端</caption>
            <colgroup id="itemCol"></colgroup>
            <colgroup id="contentCol"></colgroup>
            <thead>
              <tr>
                <th scope="col" class="text-center">項目</th>
                <th scope="col">內容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="text-center" scope="row">程式語言(框架):</th>
                <td>Node.js(Express.js)</td>
              </tr>
              <tr>
                <th class="text-center" scope="row">資料庫:</th>
                <td>MongoDB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-main>
    </el-col>    
  </el-container>
</template>

<script>
export default {
  
}

</script>

<style scoped>
.info-block {
  width: 100%;

}

.table {
  width: 350px;
  border: 2px solid #DCDFE6;
  color: #606266;
  margin-top: 30px;
  margin-left: 75px;
  float: left;
}

#itemCol {
  width: 150px;
}

.table > thead tr {
  background-color: rgb(160, 207, 255);
  font-size: 1.15rem;
}

.table > tbody tr {
  font-size: 1.05rem;
}
.table > tbody tr:hover {
  background-color: rgb(250, 236, 216);
}

</style>
