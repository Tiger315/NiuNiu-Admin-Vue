<template>
	<div class="LawList-box" v-cloak>
		<!--表格开始-->
		<el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="mailData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
			<el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
			<el-table-column fixed="left" prop="send_to" label="发送" fit show-overflow-tooltip></el-table-column>
			<el-table-column prop="send_cc" label="抄送"></el-table-column>
			<el-table-column prop="state" label="状态"></el-table-column>
			<el-table-column prop="create_date" label="创建时间"></el-table-column>
			<el-table-column fixed="right" label="操作" width="160" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native.prevent="">编辑</el-button>
					<el-button type="text" size="small" @click.native.prevent="">删除</el-button>
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
		name: 'LawList',
		data() {
			return {
				tHeight: document.documentElement.clientHeight - 135,
				zLoading: true,
				mailData: [],
				zPager: {
					total: 0,
					size: 30,
					count: 11,
					currentPage: 1
				},
				zMail: {
					id: '',
					sendTo: '',
					sendCc: '',
					state: '',
					createDate: ''
				},
				zDialog: false,
				zEditDialog: false,
				zEditUrl: '#'
			}
		},
		methods: {
			typeIndex(index) {
				return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
			},

			getMail() {
				const that = this;
				that.zLoading = true;
				let pageNum = that.zPager.currentPage;
				let pageSize = that.zPager.size;
				let apiPath = that.apiPath + 'SendMail';
				that.$ajax
					.get(apiPath)
					.then(function(response) {
						let res = response.data;
						if(res.Code === 1000) {
							that.mailData = res.Result.Data;
							that.zPager.total = res.Result.Total;
						}
						that.zLoading = false;
					})
					.catch(function(response) {})
			},
			pagerChange(val) {
				this.getMail();
			},
			seeLawDialog(row) {
				this.zLoading = true
				console.log(row)
				if(row) {
					this.zMail.sendTo = row.send_to;
					this.zMail.id = row.id;
					this.zMail.sendCc = row.send_cc;
					this.zMail.state = row.state;
					this.zMail.createDate = row.create_date;
				}
				this.zLoading = false;
				this.zDialog = true;
			}
		},
		created() {
			this.getMail();
		},
		mounted() {
			const that = this;
			window.onresize = () => {
				return(() => {
					that.tHeight = document.documentElement.clientHeight - 135;
				})()
			}
		}
	}
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
	
	.ssp {
		padding: 0 5px;
		border-right: 1px solid #717171;
		font-weight: bold;
	}
	
	.ssp:last-child {
		border: none;
	}
	
	a {
		text-decoration: none;
	}
	
	a:link {
		text-decoration: none;
	}
	
	a:visited {
		text-decoration: none;
	}
	
	a:hover {
		text-decoration: none;
	}
	
	a:active {
		text-decoration: none;
	}
	
	.el-menu-item {
		height: 18px;
		line-height: 18px;
		color: #606266;
	}
	
	.el-submenu__title {
		height: 32px;
		line-height: 32px;
		color: #606266;
	}
	
	.el-submenu__title i {
		color: #606266;
		font-style: normal;
	}
	
	.el-menu-a {
		color: #0d308c;
		font-size: 13px;
	}
</style>