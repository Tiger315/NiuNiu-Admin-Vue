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
        <el-select multiple collapse-tags clearable size="small" v-model="searchParam.companyCode"  placeholder="公司代码、简称、拼音" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select  multiple collapse-tags clearable size="small" v-model="searchParam.involveObjectId"  placeholder="发函单位" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select multiple collapse-tags clearable size="small" v-model="searchParam.avermentId" placeholder="回复状态" filterable>
          <el-option></el-option>
        </el-select>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-select multiple collapse-tags clearable size="small" placeholder="所属板块" v-model="searchParam.companyMarketId" filterable>
            <el-option></el-option>
        </el-select>
        <el-date-picker type="daterange" v-model="value4" range-separator="至" start-placeholder="发函开始时间" end-placeholder="回函日期"></el-date-picker>
        <div>
          <el-button type="primary" icon="el-icon-search" size="small" >查询</el-button>
         <el-button type="warning"  size="small"  @click="clearParam" >清空查询</el-button>
        </div>
      </el-container>
      <!-- 搜索条件结束 -->
  </div>

     <el-container>
      <!-- 展示数据开始 -->
            <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="violationCase"  stripe style="width: 100%;" empty-text=" " row-key="id">
              <el-table-column type="index" fixed="left" width="70" ></el-table-column>
              <el-table-column fixed="left" prop="docTitle" label="证券代码"  width="250"  fit show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" @click="showDetail(scope.row.id)" >{{ scope.row.docTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="left" prop="violationTypeName" label="证券简称" width="250"></el-table-column>
              <el-table-column fixed="left" prop="supervisionOrganName" label="问询类型"  width="150"></el-table-column>
              <el-table-column fixed="left"  label="函件内容" width="300">
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" >{{ scope.row.processDetails[0].involveObjectName}}</span>
                </template>
                </el-table-column>
              <el-table-column fixed="left" prop="processDate"  label="公司回复"></el-table-column>
              <el-table-column fixed="left" prop="processDate"  label="发函日期"></el-table-column>
              <el-table-column fixed="left" prop="processDate"  label="分享"></el-table-column>
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
      <!--分页结束-->
    <!--查看明细dialog结束-->
  </div>
</template>
<script>
export default {
  name: 'SupervisionType',
  data () {
    return {
      leftHeight: document.documentElement.clientHeight - 35,
      dataHeight: document.documentElement.clientHeight - 300,
      leftModelHeight: document.documentElement.clientHeight - 30,
      zDialog: true,
      zLoading: false,
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
      treeData: [{
        label: '监管措施',
        children: [{
          label: '监管关注'
        }, {
          label: '监管函'
        }, {
          label: '监管工作函'
        }]
      }],
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
    pagerChange () {

    }
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
