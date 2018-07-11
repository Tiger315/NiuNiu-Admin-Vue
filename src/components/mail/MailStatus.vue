<template>
	<div class="MailStatus-box" v-cloak>
		<!--表格开始-->
		<el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zMailStatusData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
			<el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
			<el-table-column fixed="left" prop="send_to" label="发送给" fit></el-table-column>
			<el-table-column prop="send_cc" label="抄送给" fit></el-table-column>
			<el-table-column prop="state" label="状态">
				<template slot-scope="scope">
					<el-tag :type="scope.row.state === '待发送' ? 'danger' : 'primary'" close-transition>{{scope.row.state}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="create_date" label="创建时间"></el-table-column>
			<el-table-column fixed="right" label="操作" width="160" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native.prevent="sendMail(scope.row)">重新发送</el-button>
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
  name: "MailStatus",
  data() {
    return {
      tHeight: document.documentElement.clientHeight - 50,
      zLoading: true,
      zMailStatusData: [],
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      }
    };
  },
  methods: {
    typeIndex(index) {
      return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
    },
    getMail() {
      var that = this
      that.zLoading = true
      var pageNum = that.zPager.currentPage
      var pageSize = that.zPager.size
      var apiPath = that.apiPath + "SendMail"
      that.$ajax
        .get(apiPath)
        .then(function(response) {
          var res = response.data
          if (res.Code === 1000) {
            that.zMailStatusData = res.Result.Data
            that.zPager.total = res.Result.Total
          }
          that.zLoading = false
        })
        .catch(function(response) {})
    },
    pagerChange(val) {
      this.getMail()
    },
    seeLawDialog(row) {
      this.zLoading = true
      if (row) {
        this.zMail.sendTo = row.send_to
        this.zMail.id = row.id
        this.zMail.sendCc = row.send_cc
        this.zMail.state = row.state
        this.zMail.createDate = row.create_date
      }
      this.zLoading = false
      this.zDialog = true
    },
    sendMail(row) {
      var that = this
      var id = row.id
      var apiPath = that.apiPath + "SendMail"
      delete row.state, row.create_date
      that.$ajax
        .post(apiPath, row)
        .then(function(response) {
          var res = response.data;
          if (res.Code === 1000) {
            that.$message({
              message: "发送邮件成功",
              type: "success"
            })
          }
          that.zLoading = false
        })
        .catch(function(response) {})
    }
  },
  created() {
    this.getMail()
  },
  mounted() {
    var that = this;
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 50
      })();
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
[v-cloak] {
  display: none;
}
html,
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
</style>