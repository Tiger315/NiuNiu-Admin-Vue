<template>
	<div class="MailTemplateList-box" v-cloak>
		<div class="add_btn">
			<el-button type="primary" @click="addMail.centerDialogVisible = true;isEditDialog=1" size="small">新增邮件模板</el-button>
		</div>
		<!--表格开始-->
		<el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="mailData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
			<el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
			<el-table-column fixed="left" prop="title" label="标题" fit show-overflow-tooltip></el-table-column>
			<el-table-column prop="body" label="内容">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="160" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click.native.prevent="editMailTemplate(scope.row)">编辑</el-button>
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
		<el-dialog :title="isEditDialog==1? '新增邮件模板' : '编辑邮件模板'" :visible.sync="addMail.centerDialogVisible" width="30%" center>
			<div>
				<el-input placeholder="请输入邮件标题" v-model="addMail.addMailTemplate.title" clearable>
				</el-input>
				<el-input type="textarea" @keydown.native="getResult($event)" :rows="4" id="Mail" placeholder="请输入邮件内容" class="mail-textarea" v-model="addMail.addMailTemplate.body">
				</el-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addMail.centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addMailTemplate">确 定</el-button>
			</div>
		</el-dialog>
		<!--对话框结束-->
	</div>
</template>

<script>
	export default {
		name: 'MailTemplateList',
		data() {
			return {
				tHeight: document.documentElement.clientHeight - 130,
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
				zEditUrl: '#',
				addMail: {
					centerDialogVisible: false,
					addMailTemplate: {
						title: "",
						body: "",
					}
				},
				isEditDialog: 1, //判断弹框是编辑还是新增的，1新增，2编辑
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
				let apiPath = that.apiPath + 'MailTemplate';
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
			getResult(param) {
				if(param.code == "Tab") {
					this.indentWord()
					//防止浏览器默认行为(W3C) 
					if(param && param.preventDefault) {
						param.preventDefault();
					}
					//IE中组织浏览器行为 
					else {
						window.event.returnValue = fale;
						return false;
					}
				}
			},
			addMailTemplate() {
				var addEmailParam = this.addMail.addMailTemplate;
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
				console.log(addEmailParam.body)
			},
			editMailTemplate(param) {
				this.isEditDialog = 2;
				this.addMail.centerDialogVisible = true;
				this.addMail.addMailTemplate.title = param.title;
				this.addMail.addMailTemplate.body = param.body;

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
			},
			indentWord(){
				var el = document.querySelector('textarea');
				var start = el.selectionStart,
            end = el.selectionEnd, 
            value = el.value;

        var lineStart = value.lastIndexOf('\n', start),
            lineEnd = value.indexOf('\n', end),
            offset = 0;

        if (lineStart === -1) lineStart = 0;
        if (lineEnd === -1) lineEnd = value.length;

        if (lineStart === lineEnd);
        else if (lineStart !== 0) lineStart += 1;

        var lines = value.substring(lineStart, lineEnd).split('\n');

        if (lines.length > 1) {
            offset = lines.length;
            lines = '\t' + lines.join('\n\t');

            el.value = value.substring(0, lineStart) + lines + value.substring(lineEnd);

            el.selectionStart = start + 1;
            el.selectionEnd = end + offset;
        } else {
            offset = 1;
            lines = lines[0];

            el.value = value.substring(0, start) + '\t' + value.substring(end);

            el.selectionStart = el.selectionEnd = start + offset;
        }
        
			},
		},
		created() {
			this.getMail();
		},
		mounted() {
			const that = this;
			window.onresize = () => {
				return(() => {
					that.tHeight = document.documentElement.clientHeight - 130;
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
		margin: 20px 10px;
		text-align: right;
	}
	
	
	.mail-textarea {
		margin-top: 20px;
	}
	

</style>