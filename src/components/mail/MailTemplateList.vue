<template>
	<div class="MailTemplateList-box" v-cloak>
		<!--表格开始-->
		<el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="mailData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
			<el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
			<el-table-column fixed="left" prop="title" label="标题" fit show-overflow-tooltip></el-table-column>
			<el-table-column prop="body" label="内容">
			</el-table-column>
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
		name: 'MailTemplateList',
		data() {
			return {
				tHeight: document.documentElement.clientHeight - 50,
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
					title: '',
					body: ''
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
				let apiPath =that.apiPath + 'MailTemplate';
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
				this.zLoading = true;
				if(row) {
					this.zMail.title = row.title;
					this.zMail.id = row.id;
					this.zMail.body = row.body;
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
					that.tHeight = document.documentElement.clientHeight - 50;
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
</style>