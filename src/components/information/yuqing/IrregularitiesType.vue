<template>
  <div class="IrregularitiesType">
    <el-container :height="leftHeight">
      <el-aside width="15%" :height="leftHeight" class="left">
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
            <el-select collapse-tags clearable size="small" v-model="searchParam.companyCode"  placeholder="请输入公司代码、简称" filterable>
              <el-option value=""></el-option>
            </el-select>
            <el-select collapse-tags clearable size="small" v-model="searchParam.involveObjectId"  placeholder="处罚对象身份" filterable>
              <el-option value=""></el-option>
            </el-select>
            <el-select collapse-tags clearable size="small" v-model="searchParam.avermentId" placeholder="申辩情况" filterable>
              <el-option :value="item" :key="item" v-for='item in condition.shenbian'></el-option>
            </el-select>
          </el-container>
          <el-container style="margin-top: 10px;">
            <el-date-picker type="daterange" v-model="searchParam.processDateStart" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-select collapse-tags clearable size="small" placeholder="所属板块" v-model="searchParam.companyMarketId" filterable>
              <el-option :value="item" :key="item" v-for='item in condition.area'></el-option>
            </el-select>
            <el-select collapse-tags clearable size="small" placeholder="处罚机构" v-model="searchParam.supervisionOrganId" filterable>
              <el-option value=""></el-option>
            </el-select>
          </el-container>
          <el-container style="margin-top: 10px;">
            <el-select collapse-tags clearable size="small"  placeholder="所属行业" v-model="searchParam.industryInfo" filterable>
              <el-option value=""></el-option>
            </el-select>
            <el-select  collapse-tags clearable size="small" placeholder="所属地区" v-model="searchParam.companyArea" filterable>
              <el-option :value="item" :key="item" v-for='item in condition.procvince'></el-option>
            </el-select>
            <div>
              <el-button type="primary" icon="el-icon-search" size="small" @click="searchList">查询</el-button>
            <el-button type="warning"  size="small" @click="clearParam" >清空查询</el-button>
            </div>
          </el-container>
        </el-header>
        <!-- 搜索条件结束 -->
        <el-main :height="dataHeight">
            <!--表格开始-->
              <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="violationCase"  stripe style="width: 100%;"  row-key="id">
                <el-table-column type="index" fixed="left" width="70" ></el-table-column>
                <el-table-column fixed="left" label="公司" width="100" show-overflow-tooltip>
                  <template slot-scope="scope">
                      <p>{{scope.row.companyCode}}</p>
                      <p>{{scope.row.companyName}}</p>
                  </template>
                </el-table-column>
                <el-table-column fixed="left" prop="title" label="标题"    fit show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span style="color: #0d308c; cursor: pointer; font" @click="showDetail(scope.row.id)" >{{ scope.row.title}}</span>
                  </template>
                </el-table-column>
                <el-table-column fixed="left" prop="violationTypeName" label="违规类型" ></el-table-column>
                <el-table-column fixed="left" prop="supervisionOrganName" label="处理人" ></el-table-column>

                <el-table-column fixed="left" :formatter="processDate"  label="更新时间"></el-table-column>
              </el-table>
            <!--表格结束-->
        </el-main>
        <!--分页开始-->
        <el-footer height="45">
          <div style="padding: 15px 0;  text-align: center;width:100%;margin:0px;">
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
import dialogos from './commen/dialog.vue'
export default {
  name: 'SupervisionType',
  components: {
    'li-dialogos': dialogos
  },
  data () {
    return {
      leftHeight: document.documentElement.clientHeight - 35,
      dataHeight: document.documentElement.clientHeight - 305,
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
        processDateStart: '', // 起始结束时间
        // processDateEnd: '', // 结束时间
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
      condition: {
        procvince: ['上海', '云南', '内蒙古', '北京', '吉林', '四川', '天津', '宁夏', '安徽', '山东', '山西', '广东', '广西', '新疆',
          '江苏', '江西', '河北', '河南', '浙江', '海南', '湖北', '湖南', '甘肃', '福建', '西藏', '贵州', '辽宁', '重庆', '陕西', '青海', '黑龙江'],
        shenbian: ['申辩', '听证', '全部采纳', '部分采纳', '全未采纳'],
        area: ['沪市主板', '深市主板', '深市中小板', '深市创业板', '新三板', '其他']
      },
      treeData: [{
        label: '监管措施1',
        children: [{
          label: '监管关注'
        }, {
          label: '监管函'
        }, {
          label: '监管工作函'
        }]
      }, {
        label: '监管措施2',
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
      this.msgId = ''
      this.msgId = id
    },
    searchList () {
      var that = this
      var searchParam = that.apiPath + 'XA_Wgal/Pager/' + that.searchParam.currentPage + '/30'
      that.$ajax.get(searchParam)
        .then(function (response) {
          that.violationCase = response.data.Result.Data
          that.searchParam.total = response.data.Result.Total
        })
    },
    processDate (row) {
      var date = this.dealDate(row.processDate - 0)
      return date
    },
    pagerChange () {
      this.searchList()
    }
  },
  created () {
    this.searchList()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.dataHeight = document.documentElement.clientHeight - 305
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
.IrregularitiesType .el-range__icon.el-icon-date{
    line-height: 0px ;
}
.IrregularitiesType .el-range-separator{
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
.IrregularitiesType,.IrregularitiesType>section{
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
