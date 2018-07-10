<template>
	<div class="MailTemplateList-box" v-cloak>
		<!--搜索开始-->
		<div class="add_btn">
			<el-button type="primary" @click="initModal" size="small">新增邮件模板</el-button>
		</div>
		<!--搜索结束-->
		
		<!--表格开始-->
		<el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="mailData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
			<el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
			<el-table-column fixed="left" prop="title" label="标题" fit show-overflow-tooltip></el-table-column>
			<el-table-column prop="body" label="内容">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="160" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native.prevent="editMailTemplate(scope.row,scope.$index)">编辑</el-button>
					<el-button type="text" size="small" @click.native.prevent="addMail.deleteDialogVisible = true">删除</el-button>
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

		<!--对话框开始-->
		<el-dialog :title="isEditDialog == 1? '新增邮件模板' : '编辑邮件模板'" :visible.sync="addMail.centerDialogVisible" width="30%" center>
			<div>
				<el-input placeholder="请输入邮件标题" v-model="addMail.addMailTemplate.title" clearable>
				</el-input>
				<li-ueditor ref="ueditor" :default-value='addMail.addMailTemplate.body'></li-ueditor>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addMail.centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addMailTemplate">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="" :visible.sync="addMail.deleteDialogVisible" width="30%" center>
			<h4 style="text-align: center;font-size: 16px;font-weight: 700;">请确认是否删除此模板？</h4>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="addMail.deleteDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="deleteMailTemplate()">确 定</el-button>
			 </span>
		</el-dialog>
		<!--对话框结束-->
	</div>
</template>

<script>
	import ueditor from '../commen/Ueditor.vue'
	export default {
		name: 'MailTemplateList',
		data() {
			return {
				tHeight: document.documentElement.clientHeight - 104,
				zLoading: true,
				mailData: [],
				zPager: {
					total: 0,
					size: 30,
					count: 11,
					currentPage: 1
				},
				zDialog: false,
				zEditDialog: false,
				zEditUrl: '#',
				addMail: {
					deleteDialogVisible: false,
					centerDialogVisible: false,
					addMailTemplate: {
						title: "",
						body: "",
						id: ""
					}
				},
				isEditDialog: 1, //判断弹框是编辑还是新增的，1新增，2编辑
				clickedIdx: 0 //记录当前点击编辑或者删除的下标
			}
		},
		components: {
			'li-ueditor': ueditor
		},
		props: ['defaultValue'],
		methods: {
			typeIndex(index) {
				return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
			},
			getMail() {
				var that = this;
				that.zLoading = true;
				var pageNum = that.zPager.currentPage;
				var pageSize = that.zPager.size;
				var apiPath = that.apiPath + 'MailTemplate';
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
			initModal() {
				this.addMail.centerDialogVisible = true;
				this.isEditDialog = 1;
				this.addMail.addMailTemplate.title = '';
				this.addMail.addMailTemplate.body = '';
				this.$refs.ueditor ? this.$refs.ueditor.setUEContent("") : "";
			},
			addMailTemplate() {
				var addEmailParam = this.addMail.addMailTemplate;
				addEmailParam.body = this.$refs.ueditor.getUEContent();
				var that = this;
				if(!addEmailParam.title) {
					this.$message({
						message: '请填写邮件标题！',
						type: 'warning'
					});
					return;
				} else if(!addEmailParam.body) {
					this.$message({
						message: '请填写邮件内容！',
						type: 'warning'
					});
					return;
				}
				this.addMail.centerDialogVisible = false;
				var apiPath = that.apiPath + 'MailTemplate';
				if(this.isEditDialog == 1) { //新增

					delete addEmailParam.id;
					that.$ajax
						.post(apiPath, addEmailParam)
						.then(function(response) {
							let res = response.data;
							if(res.Code == 1000) {
								addEmailParam.id = res.Result.Data;
								that.mailData.unshift(addEmailParam);
								that.$message({
									message: '添加邮件模板成功',
									type: 'success'
								});
							}
							that.zLoading = false;
						})
						.catch(function(response) {})
				} else if(this.isEditDialog == 2) {
					that.$ajax
						.put(apiPath, addEmailParam)
						.then(function(response) {
							let res = response.data;
							if(res.Code == 1000) {
								that.mailData[that.clickedIdx].title = addEmailParam.title;
								that.mailData[that.clickedIdx].body = addEmailParam.body;
								that.$message({
									message: '修改邮件模板成功',
									type: 'success'
								});
							}
							that.zLoading = false;
						})
						.catch(function(response) {})
				}

			},
			editMailTemplate(param, index) {
				this.clickedIdx = index;
				this.isEditDialog = 2;
				this.addMail.centerDialogVisible = true;
				this.addMail.addMailTemplate.title = param.title;
				if(this.$refs.ueditor) {
					this.$refs.ueditor.setUEContent(param.body)
				} else {
					this.addMail.addMailTemplate.body = param.body;
				}

				this.addMail.addMailTemplate.id = param.id;
			},
			deleteMailTemplate(index) {
				var that = this;
				var apiPath = that.apiPath + 'MailTemplate/' + that.mailData[that.clickedIdx].id;
				that.$ajax
					.delete(apiPath)
					.then(function(response) {
						let res = response.data;
						if(res.Code == 1000) {
							that.mailData.splice(that.clickedIdx, 1);
							that.addMail.deleteDialogVisible = false;
							that.$message({
								message: '删除邮件模板成功',
								type: 'success'
							});
						}
						that.zLoading = false;
					})
					.catch(function(response) {})
			},
			pagerChange(val) {
				this.getMail();
			},
		},
		created() {
			this.getMail();
		},
		mounted() {
			const that = this;
			window.onresize = () => {
				return(() => {
					that.tHeight = document.documentElement.clientHeight - 104;
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

.add_btn {
  margin: 0 10px 20px;
  text-align: right;
}

.mail-textarea {
  margin-top: 20px;
}
</style>