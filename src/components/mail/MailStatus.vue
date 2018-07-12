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
					<el-button type="text" size="small" @click.native.prevent="sendMail(scope.row,scope.$index)">{{clickedIdx==scope.$index?'发送中':'重新发送'}}
						<i :class="clickedIdx==scope.$index?'active el-icon-loading':'el-icon-loading'"></i>
					</el-button>
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
				},
				clickedIdx: -1, //当前被点击的元素
			}
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
						if(res.Code === 1000) {
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
				if(row) {
					this.zMail.sendTo = row.send_to
					this.zMail.id = row.id
					this.zMail.sendCc = row.send_cc
					this.zMail.state = row.state
					this.zMail.createDate = row.create_date
				}
				this.zLoading = false
				this.zDialog = true
			},
			sendMail(rows, index) {
				var that = this
				that.clickedIdx = index
				var apiPath = that.apiPath + "SendMail"
				var sendEmailParam = {
					id: rows.id,
					send_cc: rows.send_cc,
					send_to: rows.send_to,
					template_id: rows.template_id
				}
				that.$ajax
					.post(apiPath, sendEmailParam)
					.then(function(response) {
						var res = response.data
						var param = {}
						
						if(res.Code === 1000) {
							param.state = "已发送"
						} else {
							param.state = "发送失败"
						}
						param['id'] = rows.id
						that.getMailStatus(param)
						that.zLoading = false
					})
					.catch(function(response) {})
			},
			getMailStatus(param) {
				var that = this
				var apiPath = that.apiPath + "SendMail"
				that.$ajax
					.put(apiPath, param)
					.then(function(response) {
						var res = response.data
						if(res.Code === 1000) {
							that.$message({
								message: "发送邮件成功",
								type: "success"
							})
						} else {
							that.$message({
								message: "发送邮件失败",
								type: "success"
							})
						}
						that.zMailStatusData[that.clickedIdx].state = param.state
						that.clickedIdx = -1
						that.zLoading = false
					})
					.catch(function(response) {})
			}
		},
		created() {
			this.getMail()
		},
		mounted() {
			var that = this
			window.onresize = () => {
				return(() => {
					that.tHeight = document.documentElement.clientHeight - 50
				})()
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
<<<<<<< HEAD
[v-cloak] {
  display: none;
}

html,
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.el-icon-loading {
  display: none;
}
.active.el-icon-loading {
  display: inline-block;
  font-size: 14px;
  margin-left: 5px;
}
=======
	[v-cloak] {
		display: none;
	}
	
	html,
	body {
		padding: 0;
		margin: 0;
		font-size: 14px;
	}
	
	.el-icon-loading {
		display: none;
	}
	
	.active.el-icon-loading {
		display: inline-block;
		font-size: 14px;
		margin-left: 5px;
	}
>>>>>>> 1e79de8131d893196e977b5083d702c05f4c6555
</style>