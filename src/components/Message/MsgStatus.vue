<template>
  <div class="MsgStatus-box" v-cloak>
    <el-container style="margin-bottom: 10px;">
      <el-input placeholder="请输入接收号码" v-model="searchParam.phoneNumber"  style="width: 25%;"  size="small" clearable></el-input>
      <el-date-picker type="daterange" v-model="searchParam.time" range-separator="至" style="width:25%;;margin-left:10px;height:32px;line-height:32px;" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      <div class="ml10" style="width:180px;">
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList(1)">搜索</el-button>
        <el-button type="warning" size="small" @click="clearParam" >清空搜索</el-button>
      </div>
      <el-container class="myCount">
          我的账户:
          <span class="ml10">可用余额</span>
          <i v-if="Surplus">{{Surplus}}</i>
          <i v-else class="el-icon-loading ml10"></i>
          <span class="ml10">当月消费</span>
          <i v-if="Consumption">{{Consumption}}</i>
          <i v-else class="el-icon-loading ml10"></i>
      </el-container>
    </el-container>

    <!--表格开始-->
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zMsgStatusData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" width="70" label="序号" :index="typeIndex"></el-table-column>
      <el-table-column fixed="left" prop="SendTo" label="接收号码" width="160" fit></el-table-column>
      <el-table-column prop="ReqTime" label="请求时间" width="200"></el-table-column>
      <el-table-column prop="SendTime" label="发送时间" width="200"></el-table-column>
      <el-table-column prop="IsProxy" label="代理" width="100">
         <template slot-scope="scope">
           <el-tag :type="scope.row.IsProxy === true ? 'primary' : 'danger'" close-transition>{{scope.row.IsProxy === true ? '是' : '否'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ReqIp" label="请求IP" width="160"></el-table-column>
      <el-table-column prop="TrueIp" label="真实IP" width="160"></el-table-column>
      <el-table-column prop="Content" label="短信内容" show-overflow-tooltip></el-table-column>
    </el-table>
    <!--表格结束-->

    <!--分页开始-->
    <div style="margin-top: 10px; height: 32px; line-height: 32px; text-align: center;">
      <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPager.total }} 条</span>
      <el-pagination layout="prev, pager, next" :page-size="zPager.size" :pager-count="zPager.count" :current-page.sync="zPager.currentPage" :total="zPager.total" @current-change="pagerChange">
      </el-pagination>
    </div>
    <!--分页结束-->
  </div>
</template>
<script>
export default {
  name: 'MsgStatus',
  data () {
    return {
      tHeight: document.documentElement.clientHeight - 103,
      zLoading: true,
      zMsgStatusData: [],
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      },
      searchParam: {
        phoneNumber: '',
        time: ''
      },
      Surplus: '',
      Consumption: '',
      clickedIdx: -1 // 当前被点击的元素
    }
  },
  methods: {
    typeIndex (index) {
      return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
    },
    getMessage () {
      var that = this
      that.zLoading = true
      var apiPath = that.apiPath + 'Message/Pager/' + this.zPager.currentPage + '/' + this.zPager.size
      that.$ajax
        .get(apiPath)
        .then(res => {
          var r = res.data
          if (r.Code === 1000) {
            that.zMsgStatusData = r.Result.Data
            that.zPager.total = r.Result.Total
          }
          that.zLoading = false
        })
        .catch(res => {
          console.log(res)
        })
    },
    getUseData () {
      var that = this
      var apiPath = that.apiPath + 'Message/Remain'
      that.$ajax
        .get(apiPath)
        .then(res => {
          var r = res.data
          var data = r.Result.Data.split(',')
          that.Surplus = data[0]
          that.Consumption = data[1]
        })
        .catch(res => {
          console.log(res)
        })
    },
    pagerChange (val) {
      this.getMessage()
    }
  },
  created () {
    this.getMessage()
    this.getUseData()
  },
  mounted () {
    var that = this
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 103
      })()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.MsgStatus-box .el-range__icon.el-icon-date{
    line-height: 0px ;
}
.MsgStatus-box .el-range-separator{
  line-height:25px !important;
}
</style>

<style scoped>

[v-cloak] {
  display: none;
}
.myCount{
  font-size: 16px;
  font-weight:700;
  margin-bottom:10px;
  display: inline-block;
  text-align:right;
  padding-right:20px;
  width:200px;
  height:32px;
  line-height:40px;
}
.myCount i{
  color:#F56C6C;
}
.myCount span{
  font-size: 14px;
  font-weight:300;
}
html,
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.active.el-icon-loading {
  display: inline-block;
  font-size: 14px;
  margin-left: 5px;
}
.ml10{
  margin-left: 20px;
}
</style>
