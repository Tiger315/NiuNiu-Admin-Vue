<template>
    <div class="Huibo-box" v-cloak>
      <el-container style="margin-bottom: 10px;">
        <el-cascader placeholder="请选择类型" :options="sBox.zLawTypeData" v-model="sBox.zHuiboType" size="small" style="width: 350px;" filterable clearable></el-cascader>
        <el-input placeholder="请输入标题, 包含以下关键词（以空格区分）" v-model="sBox.zHuiboTypeKeyWords" size="small" style="width: 350px; margin-left: 20px;" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 20px;" @click="getSearch">搜索</el-button>
      </el-container>
    <!--表格开始-->
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zHuiboPresentationData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" width="70"></el-table-column>
      <el-table-column fixed="left" prop="title" label="标题" min-width="350" fit show-overflow-tooltip></el-table-column>
      <el-table-column prop="ztype" label="类型" fit></el-table-column>
      <el-table-column prop="grade" label="评级" fit></el-table-column>
      <el-table-column prop="create_date" label="时间" fit></el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="editHuibo(scope.row,scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteHuibo(scope.row,scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
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
  name: 'HuiboPresentation',
  data () {
    return {
      tHeight: document.documentElement.clientHeight - 93,
      zLoading: true,
      zHuiboPresentationData: [],
      sBox: {
        zHuiboType: [],
        zHuiboTypeKeyWords: ''
      },
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      }
    }
  },
  methods: {
    getSearch () {
      // 根据条件筛选
    },
    getHuiboPresentation () {
      var that = this
      var pageNum = that.zPager.currentPage
      var pageSize = that.zPager.size
      var apiPath = that.apiPath + 'HB_Yjbg/Pager/' + pageNum + '/' + pageSize

      that.$ajax
        .get(apiPath)
        .then(function (response) {
          var res = response.data
          if (res.Code === 1000) {
            that.zHuiboPresentationData = res.Result.Data
            that.zPager.total = res.Result.Total
          }
          that.zLoading = false
        })
        .catch(function (response) {})
    },
    pagerChange (val) {
      this.getHuiboPresentation()
    },
    editHuibo (row, id) {

    },
    // 删除慧博研究报告
    deleteHuibo (row, id) {
      var that = this
      var apiPath = that.apiPath + 'HB_Yjbg/' + id
      that.$confirm('此操作将永久删除此条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$ajax
          .delete(apiPath)
          .then(function (response) {
            var res = response.data
            if (res.Code === 1000) {
              // 删除成功更新视图
              that.zHuiboPresentationData = that.zHuiboPresentationData.filter(a => a['id'] !== id)
              // 修改总数
              that.zPager.total--
              // 删除成功提示
              that.$message({
                message: '删除邮件模板成功',
                type: 'success'
              })
            }
          })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作...'
          })
        })
    }
  },
  created () {
    this.getHuiboPresentation()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 93
      })()
    }
  }

}
</script>
<style>

</style>
