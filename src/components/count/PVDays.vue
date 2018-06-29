<template>
  <div class="law-list-wpf-box" v-cloak :style="{margin:'1rem'}">
    <!--搜索开始-->
    <el-container style="margin-bottom: 10px;">
      <el-date-picker type="date" placeholder="选择开始日期" v-model="startDateVal" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 46%;" size="small"></el-date-picker>
      <el-date-picker type="date" placeholder="选择结束日期" v-model="endDateVal" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 46%;margin-left: 10px;" size="small"></el-date-picker>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 10px;" @click="btnSearch"></el-button>
    </el-container>
    <!--搜索开始-->
    <!--统计图开始-->
    <div class="charts">
      <div id="ArticlesCharts" :style="{width:'100%',height:'500px'}">
      </div>
    </div>
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="tabledata"
      stripe style="width: 100%" highlight-current-row empty-text=" " row-key="id">
      <el-table-column  prop="time" label="日期" width="100" fit show-overflow-tooltip></el-table-column>
      <el-table-column prop="total" label="总数"  width="60"  show-overflow-tooltip></el-table-column>
      <el-table-column prop="ios" label="IOS" width="50" show-overflow-tooltip></el-table-column>
      <el-table-column prop="android" label="安卓" show-overflow-tooltip></el-table-column>
      <el-table-column prop="officalAccount" label="公众号"  show-overflow-tooltip></el-table-column>
    </el-table>
    <!--统计图结束-->
    <!--dialog开始-->
    <el-dialog :title="title" :visible.sync="dialog" style="font-weight: bold;" width="50%" top="5vh">

    </el-dialog>
    <!--dialog结束-->
  </div>

</template>
<script>
import $ from 'jquery'
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'PVDays',
  data () {
    return {
      startDateVal: '',
      endDateVal: '',
      dialog: false,
      zLoading: true,
      title: '牛牛晨会访问量统计',
      ydata: [],
      xdata: [],
      tabledata: [],
      detaildata: {
        data: [],
        title: []
      }
    }
  },
  methods: {
    btnSearch () {
      const day1 = new Date(this.startDateVal)
      const day2 = new Date(this.endDateVal)
      const diffday = parseInt((day2 - day1) / (1000 * 60 * 60 * 24))
      console.log(diffday)
      if (diffday > 6) {
        this.$message.error('结束时间只能比开始时间大七天')
      } else {
        this.getData()
        this.drawLine()
      }
    },
    drawLine () {
      const that = this
      let myChart = echarts.init(document.getElementById('ArticlesCharts'))
      myChart.setOption({
        title: {
          text: '牛牛晨会访问量统计'
        },
        tooltip: {},
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          data: that.xdata,
          type: 'category',
          axisLabel: {
            formatter: function (val) {
              return val.substring(val.indexOf('/') + 1, val.length)
            },
            interval: 0,
            margin: 3
          }
        },
        yAxis: {},
        series: [{
          name: '访问量',
          type: 'bar',
          data: that.ydata
        }]
      })
      // myChart.on('click', function (params) {
      //   that.$router.push({path: '/count/PVDetail', name: 'PVDetail', params: { name: 'time', dataObj: params.name }})
      // })
    },
    getData () {
      const that = this
      $.ajax({
        async: false,
        url: 'http://112.124.98.197:10001/api?visitBeginDate=' + that.startDateVal + '&visitEndDate=' + that.endDateVal,
        dataType: 'json',
        type: 'GET',
        headers: {
          'Request-Action': 'MorningConference-Analyze'
        },
        success: function (res) {
          that.zLoading = false
          that.ydata = res.data.articles_y
          that.xdata = res.data.articles_x
          that.tabledata = res.data.table
        },
        error: function (a, b, c) {
          that.zLoading = false
          this.$message.error('获取数据异常')
        }
      })
    }
  },
  mounted () {
    var startDate = new Date()
    this.endDateVal = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
    startDate.setDate(startDate.getDate() - 6)
    this.startDateVal = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate()
    this.getData()
    this.drawLine()
    document.title = '牛牛晨会访问量统计'
  }
}
</script>
