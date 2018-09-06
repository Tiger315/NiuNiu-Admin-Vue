<template>
  <div class="Managers">
    <!-- 搜索条件开始 -->
    <el-container style="margin-bottom:10px;padding:0 20% 0 0;">
        <el-input placeholder="包含所有关键词(以空格区分)" v-model="searchParam.titleMust" size="small" clearable  class="ml20 noMl"></el-input>
        <el-input placeholder="包含任意关键词(以空格区分)" v-model="searchParam.titleCan" size="small" clearable class="ml20"></el-input>
        <el-input placeholder="不包含任意关键词(以空格区分)" v-model="searchParam.titleNot" size="small" clearable class="ml20"></el-input>
    </el-container>
    <el-container style="margin-bottom:10px;padding:0 20% 0 0;">
        <el-select multiple collapse-tags clearable size="small" v-model="searchParam.stock_code" placeholder="公司代码、简称、拼音" filterable class="ml20 noMl">
          <el-option :label="item.Name+'('+item.Code+')'" :key="item.Name+'('+item.Code+')'" v-for='item in topData.companyCode' :value="item.Code"></el-option>
          <!-- <el-option v-for='item in topData.companyCode' :key="item.Company_Name+'('+item.Company_Code+')'" :label="item.Company_Name+'('+item.Company_Code+')'" :value="item.Company_Code"></el-option> -->
        </el-select>
        <el-select collapse-tags clearable size="small" placeholder="所属板块" v-model="searchParam.template" filterable class="ml20">
          <el-option v-for='item in topData.bankuai' :key="item.Value" :label="item.Text" :value="item.Value"></el-option>
        </el-select>
        <el-select collapse-tags clearable size="small" v-model="searchParam.reply_status" placeholder="回复状态" filterable class="ml20">
          <el-option v-for='item in topData.replyStatus' :key="item.code" :label="item.status" :value="item.code"></el-option>
        </el-select>
     </el-container>
    <el-container style="margin-bottom:10px;padding:0 20% 0 0;">
      <el-date-picker v-model="searchParam.processDateStart" type="date" placeholder="开始日期" class="ml20 noMl"></el-date-picker>
      <el-date-picker v-model="searchParam.processDateEnd" type="date" placeholder="结束日期" class="ml20"></el-date-picker>
      <div class="ml20">
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
        <el-button type="warning" size="small" @click="clearParam">清空搜索</el-button>
      </div>
    </el-container>
    <!-- 搜索条件结束 -->

    <!-- 表格数据开始 -->
    <el-table v-loading.loading="loadingData.loading" element-loading-text="拼命加载中" :height="dataHeight" :data="tableData" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" label="序号" width="70" :index="typeIndex">序号</el-table-column>
      <el-table-column prop="CompanyCode" label="公司代码" width="150"></el-table-column>
      <el-table-column prop="Name" label="公司名称" width="150"></el-table-column>
      <el-table-column prop="UserName" label="总经理" width="100"></el-table-column>
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
export default {
  name: 'Managers',
  data () {
    return {
      dataHeight: document.documentElement.clientHeight - 177,
      loadingData: {
        loading: false,
        diaLoading: false
      },
      dialog: false,
      detailData: '',
      urlData: {
        showWordUrl: '',
        pdfUrl: '',
        numPages: undefined
      },
      searchParam: {
        time: '',
        titleMust: '', // 必含关键词
        titleCan: '', // 可含关键词
        titleNot: '', // 不含关键词
        stock_code: [], // 公司代码
        spliteStockCode: '',
        send_unit: '', // 发文单位
        reply_status: '', // 回复状态
        template: '', // 所属板块
        processDateStart: '', // 起始时间
        processDateEnd: '' // 结束时间
      },
      topData: {
        bankuai: [],
        replyStatus: [{ 'status': '全部', 'code': 0 }, { 'status': '已回复', 'code': 1 }, { 'status': '未回复', 'code': 2 }],
        companyCode: []
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
    clearParam () {
      this.zPager.currentPage = 1
      for (var key in this.searchParam) {
        this.searchParam[key] = ''
      }
      this.searchParam.stock_code = []
      this.getList()
    },
    PositionDate (row) {
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
      if (this.searchParam.processDateStart || this.searchParam.processDateEnd) {
        // if (!this.searchParam.processDateStart) {
        //   this.$message.error('请选择开始日期！')
        //   return
        // }
        // if (!this.searchParam.processDateEnd) {
        //   this.$message.error('请选择结束日期！')
        //   return
        // }
        if (this.searchParam.processDateStart > this.searchParam.processDateEnd) {
          this.$message.error('开始时间不能大于结束时间！')
          return
        }
      }
      that.getSearchParam()
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
    getSearchParam () {
      // 获取查询的参数
      // 处理开始结束时间
      this.searchParam.processDateStart = this.searchParam.processDateStart && this.dealDate(this.searchParam.processDateStart) // 开始时间
      this.searchParam.processDateEnd = this.searchParam.processDateEnd && this.dealDate(this.searchParam.processDateEnd) // 结束时间
      // 处理公司代码
      if (this.searchParam && this.searchParam.stock_code) {
        this.searchParam.stock_code.length > 1 ? this.searchParam.spliteStockCode = this.searchParam.stock_code.join(',') : this.searchParam.spliteStockCode = this.searchParam.stock_code[0]
      } else {
        this.searchParam.spliteStockCode = ''
      }
    },
    getTopData () {
      var that = this
      that.$ajax.get(that.apiPath + 'StockPlate')
        .then(function (response) {
          var data = response.data.Result.Data
          that.topData.bankuai = data
        })

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
