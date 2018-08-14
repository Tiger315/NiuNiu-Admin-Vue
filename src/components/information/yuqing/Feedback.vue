<template>
  <div class="Feedback">
    <div class="searchParam">
        <!-- 搜索条件开始 -->
       <el-container style="margin-top: 10px;">
        <el-input placeholder="包含所有关键词(以空格区分)" v-model="searchParam.titleMust"  size="small"  clearable></el-input>
        <el-input placeholder="包含任意关键词(以空格区分)" v-model="searchParam.titleCan"  size="small" clearable></el-input>
        <el-input placeholder="不包含任意关键词(以空格区分)" v-model="searchParam.titleNot"  size="small"  clearable></el-input>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-select collapse-tags clearable size="small" v-model="searchParam.companyCode"  placeholder="公司代码、简称、拼音" filterable>
          <el-option v-for='item in topData.companyCode' :key="item.Company_Name" :value="item.Company_Name+'('+item.Company_Code+')'"></el-option>
        </el-select>
        <el-select  multiple collapse-tags clearable size="small" v-model="searchParam.involveObjectId"  placeholder="发函单位" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select collapse-tags clearable size="small" v-model="searchParam.avermentId" placeholder="回复状态" filterable>
          <el-option v-for='item in topData.replyStatus' :key="item.code" :value="item.status"></el-option>
        </el-select>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-select multiple collapse-tags clearable size="small" placeholder="所属板块" v-model="searchParam.companyMarketId" filterable>
            <el-option v-for='item in topData.bankuai' :key="item.Value" :value="item.Text"></el-option>
        </el-select>
        <el-date-picker type="daterange" v-model="value4" range-separator="至" start-placeholder="发函开始时间" end-placeholder="回函日期"></el-date-picker>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small" >搜索</el-button>
         <el-button type="warning"  size="small"  @click="clearParam" >清空搜索</el-button>
        </div>
      </el-container>
      <!-- 搜索条件结束 -->
  </div>

     <el-container>
      <!-- 展示数据开始 -->
            <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="tableData"  stripe style="width: 100%;" empty-text=" " row-key="id">
              <el-table-column type="index" fixed="left" width="70" ></el-table-column>
              <el-table-column fixed="left" prop="Company_Code" label="证券代码"  width="250"  fit show-overflow-tooltip>
              </el-table-column>
              <el-table-column fixed="left" prop="Company_Name" label="证券简称" width="250"></el-table-column>
              <el-table-column fixed="left" prop="Letter_TypeValue" label="问询类型"  width="150"></el-table-column>
              <el-table-column fixed="left" prop="Letter_ContentName"  label="函件内容" width="300">
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" @click="showPDF(scope.row.Letter_Content)">{{ scope.row.Letter_ContentName}}</span>
                </template>
                </el-table-column>
              <el-table-column fixed="left" prop="Company_ReplyName"  label="公司回复">
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" @click="showPDF(scope.row.Company_Reply)">{{ scope.row.Company_ReplyName}}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="left" prop="SendDate"  label="发函日期"></el-table-column>
            </el-table>
          <!-- 展示数据结束 -->
     </el-container>

       <!--分页开始-->
       <el-container height="45">
         <div style="padding: 10px 15px 0px;  text-align: center;width:100%;margin:0px;">
          <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPager.total }} 条</span>
          <el-pagination layout="prev, pager, next" :page-size="zPager.size" :pager-count="zPager.count" :current-page.sync="zPager.currentPage" :total="zPager.total" @current-change="pagerChange">
          </el-pagination>
        </div>
       </el-container>
  <el-dialog  :visible.sync="zDialog"  style="font-weight: bold;margin:0px;" fullscreen>
      <div class="dialog-box" v-loading="zLoading">
        <el-container :height="leftModelHeight">
          <canvas id="the-canvas"></canvas>
        </el-container>
      </div>
    </el-dialog>

      <!--分页结束-->
    <!--查看明细dialog结束-->
  </div>
</template>
<script>
import PDFJS from '../../../../static/js/pdfjs-1.10.88-dist/build/pdf.js'
export default {
  name: 'SupervisionType',
  data () {
    return {
      leftHeight: document.documentElement.clientHeight - 35,
      dataHeight: document.documentElement.clientHeight - 300,
      leftModelHeight: document.documentElement.clientHeight - 30,
      zDialog: false,
      zLoading: false,
      pdfUrl: '',
      searchParam: {
        titleMust: '', // 必含关键词
        titleCan: '', // 可含关键词
        titleNot: '', // 不含关键词
        companyCode: '', // 公司代码简称
        involveObjectId: '', // 处罚对象身份
        avermentId: '', // 申辩情况
        processDateStart: '', // 起始时间
        processDateEnd: '', // 结束时间
        companyMarketId: '', // 所属板块
        industryInfo: '', // 所属行业
        companyArea: '', // 所属地区
        supervisionOrganId: ''// 监管机构
      },
      value4: '',
      topData: {
        bankuai: [],
        replyStatus: [{'status': '全部', 'code': 0}, {'status': '已回复', 'code': 1}, {'status': '未回复', 'code': 2}],
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
    clearParam () {
      for (var key in this.searchParam) {
        this.searchParam[key] = ''
      }
    },
    getList (flag) {
      var that = this
      if (flag) {

      } else {
        var apiPath = that.apiPath + 'Regulatory_Letters/Pager/1/30'
      }
      that.$ajax.get(apiPath)
        .then(function (response) {
          var data = response.data.Result
          that.tableData = data.Data
          that.zPager.total = data.Total
        })
    },
    showPDF (urls) {
      var that = this
      this.zLoading = true
      this.zDialog = true
      PDFJS.workerSrc = '../../../../static/js/pdfjs-1.10.88-dist/build/pdf.worker.js' // 加载核心库
      PDFJS.getDocument(urls).then(function getPdfHelloWorld (pdf) {
        //
        // 获取第一页数据
        //
        pdf.getPage(1).then(function getPageHelloWorld (page) {
          that.zLoading = false
          var scale = 1.5
          var viewport = page.getViewport(scale)

          //
          // Prepare canvas using PDF page dimensions
          //
          var canvas = document.getElementById('the-canvas')
          var context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          //
          // Render PDF page into canvas context
          //
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          }
          page.render(renderContext)
        })
      })
      this.pdfUrl = urls
    },
    getTopData () {
      var that = this
      that.$ajax.get(that.apiPath + 'StockPlate')
        .then(function (response) {
          var data = response.data.Result.Data
          that.topData.bankuai = data
        })

      that.$ajax.get(that.apiPath + 'Regulatory_Letters_Company')
        .then(function (response) {
          var data = response.data.Result.Data
          that.topData.companyCode = data
        })
    },
    pagerChange () {
      this.getList(1)
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
        that.dataHeight = document.documentElement.clientHeight - 300
        that.leftHeight = document.documentElement.clientHeight - 35
      })()
    }
  }

}
</script>
<style>
.Feedback .el-dialog{
  background-color:rgba(0,0,0,.3);
}
.el-input__inner{
  height: 32px;
  line-height:32px;
}
.el-input__icon{
    line-height:32px;
}
.el-aside.left{
    border-right: 1px solid #f2f4f7;
    box-sizing: border-box
}
.Feedback .el-range__icon.el-icon-date{
    line-height: 0px ;
}
.Feedback .el-range-separator{
  line-height:25px !important;
}
</style>

<style scoped>
.SupervisionType{
  width:100%;
  padding:0px;
  margin:0px;
  overflow-x: hidden;
}
.SupervisionType,.SupervisionType>section{
  height: 100%;
}
.title{
    margin-left:8px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    line-height: 36px;
    font-weight: 700;
}
.el-container{
    justify-content: center
}
.searchParam>.el-container{
  width:100%
}
.searchParam{
  margin-bottom:20px
}
.searchParam>.el-container>div{
  width: 33.3%;
  margin:0 15px;
  box-sizing: border-box
}
.el-main{
  padding:0px 20px;
  margin-top:20px;
}

</style>
