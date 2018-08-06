<template>
  <div class="SupervisionType">
    <el-container :height="leftHeight">
      <el-aside width="15%" height="100%" class="left">
        <div class="title">违规类型</div>
        <el-tree :data="treeData"></el-tree>
      </el-aside>
    <el-container>
      <!-- 搜索条件开始 -->
      <el-header height="240">
       <el-container style="margin-top: 10px;">
        <el-input placeholder="必含关键词（以空格区分）" v-model="searchParam.titleMust"  size="small"  clearable></el-input>
        <el-input placeholder="可含关键词（以空格区分）" v-model="searchParam.titleCan"  size="small" clearable></el-input>
        <el-input placeholder="不含关键词（以空格区分）" v-model="searchParam.titleNot"  size="small"  clearable></el-input>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-select multiple collapse-tags size="small" v-model="searchParam.companyCode"  placeholder="请输入公司代码、简称" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select  multiple collapse-tags size="small" v-model="searchParam.involveObjectId"  placeholder="处罚对象身份" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select multiple collapse-tags size="small" v-model="searchParam.avermentId" placeholder="申辩情况" filterable>
          <el-option></el-option>
        </el-select>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-date-picker  type="date" value=""  placeholder="起始日期" v-model="searchParam.processDateStart"></el-date-picker>
        <el-date-picker  type="date" value=""  placeholder="结束日期" v-model="searchParam.processDateEnd"></el-date-picker>
        <el-select multiple collapse-tags size="small" placeholder="所属板块" v-model="searchParam.companyMarketId" filterable>
          <el-option></el-option>
        </el-select>
      </el-container>
      <el-container style="margin-top: 10px;">
        <el-select multiple collapse-tags size="small"  placeholder="所属行业" v-model="searchParam.industryInfo" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select  multiple collapse-tags size="small" placeholder="所属地区" v-model="searchParam.companyArea" filterable>
          <el-option ></el-option>
        </el-select>
        <el-select multiple collapse-tags size="small" placeholder="处罚机构" v-model="searchParam.supervisionOrganId" filterable>
          <el-option></el-option>
        </el-select>
      </el-container>
       <el-container style="margin-top: 10px;">
         <el-button type="primary" icon="el-icon-search" size="small" style="margin-top: 20px;" @click="searchList">查询</el-button>
         <el-button type="warning"  size="small" style="margin-top: 20px;" @click="clearParam" >清空查询</el-button>
      </el-container>
      </el-header>
      <!-- 搜索条件结束 -->
      <el-main :height="dataHeight">
          <!--表格开始-->
            <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="violationCase"  stripe style="width: 100%;" empty-text=" " row-key="id">
              <el-table-column type="index" fixed="left" width="70" ></el-table-column>
              <el-table-column fixed="left" label="公司" width="100" show-overflow-tooltip>
                 <template slot-scope="scope">
                    <p>{{scope.row.companyCode}}</p>
                    <p>{{scope.row.companyName}}</p>
                </template>
              </el-table-column>
              <el-table-column fixed="left" prop="docTitle" label="标题"  width="250"  fit show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" @click="showDetail(scope.row.id)" >{{ scope.row.docTitle }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="left" prop="violationTypeName" label="违规类型" width="250"></el-table-column>
              <el-table-column fixed="left" prop="supervisionOrganName" label="处理人"  width="150"></el-table-column>
              <el-table-column fixed="left"  label="处罚对象" width="300">
                <template slot-scope="scope">
                  <span style="color: #0d308c; cursor: pointer; font" >{{ scope.row.processDetails[0].involveObjectName}}</span>
                </template>
                </el-table-column>
              <el-table-column fixed="left" prop="processDate"  label="更新时间"></el-table-column>
            </el-table>
          <!--表格结束-->
      </el-main>
       <!--分页开始-->
       <el-footer height="45">
         <div style="padding: 10px 15px 0px;  text-align: center;width:100%;margin:0px;">
          <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ searchParam.total }} 条</span>
          <el-pagination layout="prev, pager, next" :page-size="searchParam.size" :pager-count="searchParam.count" :current-page.sync="searchParam.currentPage" :total="searchParam.total" @current-change="pagerChange">
          </el-pagination>
        </div>
       </el-footer>
        <!--分页结束-->
    </el-container>
  </el-container>
  <li-dialogos :msg-id="msgId" msg-type="1" ></li-dialogos>
  </div>
</template>
<script>
import dialogo from './commen/dialog.vue'
export default {
  name: 'SupervisionType',
  components: {
    'li-dialogos': dialogo
  },
  data () {
    return {
      leftHeight: document.documentElement.clientHeight - 35,
      dataHeight: document.documentElement.clientHeight - 300,
      zDialog: true,
      zLoading: false,
      msgId: '',
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
        supervisionOrganId: '', // 处罚机构
        total: 0,
        size: 30,
        count: 11,
        sortType: 'desc',
        currentPage: 1
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
      violationCase: []
    }
  },
  methods: {
    clearParam () {
      for (var key in this.searchParam) {
        this.searchParam[key] = ''
      }
    },
    showDetail (id) {
      console.log(this.msgId)
      this.msgId = ''
      this.msgId = id
    },
    searchList () {
      var that = this
      var searchParam = 'https://goldeye.cfbond.com/cattle/es_jgh_list?'
      for (var key in this.searchParam) {
        if (key === 'titleMust') {
          searchParam += key + '=' + this.searchParam[key]
        } else {
          searchParam += '&' + key + '=' + this.searchParam[key]
        }
      }
      that.$ajax.get(searchParam)
        .then(function (response) {
          that.violationCase = response.data.data.dataList
          that.searchParam.total = response.data.data.totalCount
        })
    },
    pagerChange () {
      this.searchList()
    }
  },
  mounted () {
    this.searchList()
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
.el-container>div{
  width: 33.3%;
  margin:0 15px;
  box-sizing: border-box
}
.el-main{
  padding:0px 20px;
  margin-top:20px;
}
a.detail_title{
    font-size: 16px;
    color: #0d308c;
    cursor: pointer;
    text-decoration: none;
}
span.detail_date {
    font-size: 14px;
    color: #999;
}
.detail_msg{
    margin-top: 13px;
}
.detail_content,.detail_msg{
    line-height: 16px;
    margin-top: 10px;
    font-size: 14px;
    color: #999;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.showData{
  border-bottom:1px solid #f2f4f7;
}

</style>
