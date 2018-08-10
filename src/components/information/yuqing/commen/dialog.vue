<template>
    <el-dialog  :visible.sync="zDialog" :before-close="closeModel" style="font-weight: bold;margin:0px;" fullscreen>
      <div class="dialog-box" v-loading="zLoading">
        <el-container :height="leftModelHeight">
          <el-aside width="33.3%" >
            <div>
              <div class="detail-card">
              <div class="card-head">基本信息</div>
                  <div class="card-body">
                    <p>证券代码：{{zDetail.companyCode}}</p>
                    <p>证券简称：{{zDetail.companyName}}</p>
                    <p>所属板块：{{zDetail.companyMarketName}}</p>
                    <p>所属地区：{{zDetail.companyArea}}</p>
                    <p>所属行业：{{zDetail.SecondIndustryName}}</p>
                    <p>申辩情况：{{zDetail.avermentName}}</p>
                  </div>
              </div>
            </div>
             <div>
              <div class="detail-card">
              <div class="card-head">违规信息</div>
                  <div class="card-body">
                    <p>监管机构：{{zDetail.supervisionOrganName}}</p>
                    <p>文号：{{zDetail.lssuedNumber}}</p>
                    <p>监管类型：{{zDetail.supervisionTypeName}}</p>
                    <p>违规类型：{{zDetail.violationTypeName}}</p>
                    <p>处理日期：{{zDetail.processDate}}</p>
                  </div>
              </div>
            </div>
             <div>
              <div class="detail-card">
              <div class="card-head">相关案例</div>
                  <div class="card-body">
                    <p v-for="val in relationCaseLawList"  :key="val" @click="getDetail (val.id)">{{val.title}}</p>
                  </div>
              </div>
            </div>
          </el-aside>
          <el-container>
            <el-header class="showPdf" :height="leftModelHeight">
              <div v-html='zDetail.docContent' class="docTitle"></div>
            </el-header>
            <el-main class="table2" >
              <el-table align="center" header-align="center"  :data="tableData" border style="width: 100%">
                <el-table-column fixed prop="involveObjectName" label="涉及当事人" width="350"> </el-table-column>
                <el-table-column fixed prop="objectPositionName" label="涉及对象"></el-table-column>
                <el-table-column fixed prop="supervisionTypeName" label="监管类型"></el-table-column>
                <el-table-column fixed prop="violationTypeName" label="违规类型"></el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </el-dialog>
</template>
<script>
export default {
  name: 'dialogs',
  data () {
    return {
      zDialog: false,
      zLoading: '',
      searchId: '',
      leftModelHeight: document.documentElement.clientHeight - 30,
      zDetail: {},
      relationCaseLawList: [],
      tableData: []
    }
  },
  props: ['msgId', 'msgType'],
  methods: {
    getDetail (id) {
      var that = this
      that.$ajax
        .get('https://goldeye.cfbond.com/cattle/es_jgh_detail?id=' + id)
        .then(function (response) {
          that.zLoading = false
          that.zDetail = response.data.data
          that.relationCaseLawList = response.data.data.relationCaseLawList
          that.tableData = response.data.data.processDetails
        })
    },
    closeModel () {
      this.zDialog = false
      this.msgId = ''
      this.searchId = ''
    }

  },
  watch: {
    msgId: function (newVal, oldVal) {
      if (newVal) {
        this.zDialog = true // newVal即是新的id值
        this.searchId = newVal
        this.getDetail(this.searchId)
      }
    }
  }
}
</script>
<style>
.docTitle p{
    text-indent: 2em;
    font-size: 14px;
    line-height: 2em;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 300;
}
.table2 .el-table--border{
  border: 1px solid #d4dbe3 !important;
}
.table2 .el-table th {
  background-color:#f3f4f8 !important;
  border:none;
  border-right: 1px solid #d4dbe3 !important;
  border-bottom: 1px solid #d4dbe3 !important;
}
.table2 .el-table td{
    color: rgba(0, 0, 0, 0.65);
    font-weight: 300;
}
.table2 .el-table  th,.table2 .el-table  td{
  text-align: center;
}
.SupervisionType .el-dialog__body{
  padding-top:0px;
}
.SupervisionType .el-dialog__headerbtn{
    top: 0px;
}
</style>
<style scoped>
.detail-card{
    border: 1px solid #d4dbe3;
    font-size: 16px;
    margin-bottom: 10px;
}
.showPdf{
  margin-bottom:20px;
}
.card-head{
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    color: #333;
    background: #f3f4f8;
    border-bottom: 1px solid #d4dbe3;
}
 .card-body{
    padding: 12px 20px 8px;
    background: #fff;
    font-size: 14px;
    line-height: 1.8em;
}
.card-body p {
  margin:0px;
    padding: 3px 0;
    text-indent: 2em;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight:300;
    cursor: pointer;
}
</style>
