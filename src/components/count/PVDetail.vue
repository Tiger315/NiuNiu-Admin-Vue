<template>
    <div class="charts" :style="{margin:'1rem'}">
      <div id="detailCharts" :style="{width:'100%',height:'500px'}">
      </div>
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
      detaildata: {
        data: [],
        title: []
      }
    }
  },
  methods: {
    getDetialData () {
      const that = this
      console.log(that.$route.params.dataObj)
      $.ajax({
        async: false,
        url: 'http://112.124.98.197:10001/api?visitDate=' + that.$route.params.dataObj,
        dataType: 'json',
        type: 'GET',
        headers: {
          'Request-Action': 'MorningConference-Analyze2'
        },
        success: function (res) {
          that.detaildata.data = res.data.hours
          for (let item of res.data.hours) {
            that.detaildata.title.push(item.name)
          }
        },
        error: function (a, b, c) {
          alert('获取数据异常')
        }
      })
    },
    openDetialHV () {
      const that = this
      let detailChart = echarts.init(document.getElementById('detailCharts'))
      detailChart.setOption({
        title: {
          text: '当日访问量明细',
          subtext: '小时维度',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: that.detaildata.title
        },
        series: [
          {
            name: '访问量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: that.detaildata.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.getDetialData()
    this.openDetialHV()
    document.title = '牛牛晨会访问量统计'
  }
}
</script>
