<template>
  <div class="Managers"  :element-loading-text="loadingData.loadingText" v-loading.loading="loadingData.loading">
    <form id="exportRule" :action="downloadUrl" method="get" style="display: none;">
    </form>
    <!-- 搜索条件开始 -->
    <el-container style="margin-bottom:10px;padding:0 20% 0 0;">
        <el-select multiple collapse-tags clearable size="small" v-model="searchParam.stock_code" placeholder="公司代码、简称、拼音" filterable class="ml20 noMl">
          <el-option :label="item.Name+'('+item.Code+')'" :key="item.Name+'('+item.Code+')'" v-for='item in topData.companyCode' :value="item.Code"></el-option>
        </el-select>
        <el-select collapse-tags clearable size="small" placeholder="人员身份" v-model="searchParam.identity" filterable class="ml20">
          <el-option v-for='item in topData.shenfen' :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-input placeholder="姓名" v-model="searchParam.name" size="small" clearable class="ml20"></el-input>
    </el-container>
    <el-container style="margin-bottom:10px;padding:0 20% 0 0;">
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
        <el-button type="warning" size="small" @click="clearParam">清空搜索</el-button>
    </el-container>
    <!-- 搜索条件结束 -->
    <div style="margin-bottom:10px;text-align:right;padding-right:20px;" >
      <el-button type="primary" size="small" @click="exportExcel">
        导出
        <!-- <a style="color:#fff;text-decoration:none;"  download :href="downloadUrl">导出</a> -->
      </el-button>
    </div>
    <!-- 表格数据开始 -->
    <el-table  element-loading-text="拼命加载中" :height="dataHeight" :data="tableData" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" label="序号" width="70" :index="typeIndex">序号</el-table-column>
      <el-table-column prop="CompanyCode" label="公司代码" width="150"></el-table-column>
      <el-table-column prop="Name" label="公司名称" width="150"></el-table-column>
      <el-table-column prop="UserName" label="姓名" width="100"></el-table-column>
      <el-table-column prop="Sex" label="性别" width="100"></el-table-column>
      <el-table-column prop="Highest_Degree" label="学历" width="100"></el-table-column>
      <el-table-column prop="Resume" label="简介"  fit show-overflow-tooltip>
         <template slot-scope="scope">
          <span style="color: #0d308c; cursor: pointer; font" @click="showDetail(scope.row.Resume)">{{ scope.row.Resume }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任职时间" width="250" :formatter="PositionDate">
      </el-table-column>
    </el-table>
    <!-- 表格数据结束 -->

    <!--分页开始-->
    <div style="margin-top: 10px;height: 32px; line-height: 32px; text-align: center;">
      <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPager.total }} 条</span>
      <el-pagination layout="prev, pager, next" :page-size="zPager.size" :pager-count="zPager.count" :current-page.sync="zPager.currentPage" :total="zPager.total" @current-change="pagerChange">
      </el-pagination>
    </div>
    <!--分页结束-->

    <!--查看明细dialog开始-->
    <el-dialog title="个人简介"  :visible.sync="dialog" style="font-weight: bold;" fullscreen>
      <div class="dialog-box" v-loading="loadingData.loading">
        {{detailData}}
      </div>
    </el-dialog>
    <!--查看明细dialog结束-->
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'Managers',
  data () {
    return {
      dataHeight: document.documentElement.clientHeight - 177,
      loadingData: {
        loading: false,
        diaLoading: false,
        loadingText: '拼命加载中'
      },
      downloadUrl: 'http://192.168.0.118:8022/api/v1/CompanyManagerExport',
      dialog: false,
      detailData: '',
      searchParam: {
        stock_code: [], // 公司代码
        identity: '', // 人员身份
        name: ''// 姓名
      },
      topData: {
        shenfen: [{
          id: 0,
          name: '全部'
        }, {
          id: 1,
          name: '董事会'
        }, {
          id: 3,
          name: '监视会'
        }, {
          id: 2,
          name: '高级管理人员'
        }]
      },
      tableData: [],
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      }
    }
  },
  methods: {
    closeModel () {
      this.loadingData.loading = false
      this.dialog = false
    },
    showDetail (detail) {
      this.detailData = detail
      this.dialog = true
    },
    typeIndex (index) {
      return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
    },
    exportExcel () {
      var that = this
      that.loadingData.loading = true
      that.loadingData.loadingText = '正在导出，请稍后...'
      var apiPath = ''
      apiPath = 'http://192.168.0.118:8022/api/v1/' + 'CompanyManagerExport'
      that.$ajax.get(apiPath)
        .then(function (response) {
          that.loadingData.loading = false
          that.loadingData.loadingText = '拼命加载中'
          $('#exportRule').submit()
        }).catch(function (res) {
          console.log(res)
          that.loadingData.loading = false
          that.loadingData.loadingText = '拼命加载中'
        })
    },
    clearParam () { // 清空查询条件
      this.zPager.currentPage = 1
      for (var key in this.searchParam) {
        this.searchParam[key] = ''
      }
      this.searchParam.stock_code = []
      this.getList()
    },
    PositionDate (row) { // 处理表格中的任职时间
      let startDate = row.Position_StartDate && row.Position_StartDate.split('T')[0]
      let endDate = row.Position_EndDate && row.Position_EndDate.split('T')[0]
      if (startDate && endDate) {
        return startDate + '—' + endDate
      } else if (startDate && !endDate) {
        return startDate + '—至今'
      } else {
        return '至今'
      }
    },
    getList () {
      var that = this
      that.loadingData.loading = true
      var apiPath = ''
      apiPath = that.apiPath + 'CompanyManager/Pager/' + (this.searchParam.titleMust || '[]') + '/' + (this.searchParam.titleCan || '[]') + '/' + (this.searchParam.titleNot || '[]') + '/' + (this.searchParam.spliteStockCode || '[]') + '/' + (this.searchParam.send_unit || '[]') + '/' + (this.searchParam.reply_status || 0) + '/' + (this.searchParam.template || '[]') + '/' + (this.searchParam.processDateStart || '[]') + '/' + (this.searchParam.processDateEnd || '[]') + '/' + this.zPager.currentPage + '/' + this.zPager.size
      apiPath = 'http://192.168.0.118:8022/api/v1/' + 'CompanyManager/Pager/' + this.zPager.currentPage + '/' + this.zPager.size
      that.$ajax.get(apiPath)
        .then(function (response) {
          that.loadingData.loading = false
          var data = response.data.Result
          that.tableData = data.Data
          that.zPager.total = data.Total
        })
    },
    getTopData () {
      var that = this
      that.$ajax.get(that.apiPath + 'StockInfo')
        .then(function (response) {
          var data = response.data.Result.Data
          that.topData.companyCode = data
        })
    },
    pagerChange () {
      this.getList()
    }
  },
  created () {
    this.getTopData()
    this.getList()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.dataHeight = document.documentElement.clientHeight - 177
      })()
    }
  }

}
</script>
<style>
.dialog-box .el-loadingData.loading-mask {
  width: 40% !important;
  margin-left: 30%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
}
.noMl.ml20 {
  margin-left: 0px;
}
.ml20 {
  margin-left: 20px;
  width: 33.3% !important;
}
.Managers .el-dialog {
  padding:0 20%;
  background-color: #f4f5f5;
}
.Managers .el-dialog__header{
  padding-left:0px;
}
.Managers .el-dialog .el-dialog__body{
  height: 100%;
  text-indent: 2em;
  box-shadow: 1px 1px 8px rgba(0,0,0,.15);
  background-color: #fff;
  border-radius: 2px;
}
.el-input__inner {
  height: 32px;
  line-height: 32px;
}
.el-input__icon {
  line-height: 32px;
}
.el-aside.left {
  border-right: 1px solid #f2f4f7;
  box-sizing: border-box;
}
.Managers .el-range__icon.el-icon-date {
  line-height: 0px;
}
.Managers .el-range-separator {
  line-height: 25px !important;
}
</style>

<style scoped>
.downLoad {
  position: fixed;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  display: block;
  left: 10px;
  top: 10px;
  text-decoration: none;
}
.downLoad > p {
  margin: 0px;
  font-size: 12px;
}
.showPDF {
  justify-content: center !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.el-container > div:first-child{
  margin-left:0px;
}
.el-container > div {
  width: 33.3%;
  margin: 0 15px 0 0;
  box-sizing: border-box;
}
#pop canvas {
  width: 100%;
  float: left;
}
.SupervisionType {
  width: 100%;
  padding: 0px;
  margin: 0px;
  overflow-x: hidden;
}
.SupervisionType,
.SupervisionType > section {
  height: 100%;
}
.title {
  margin-left: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  line-height: 36px;
  font-weight: 700;
}
.el-container {
  justify-content: left;
}
</style>
