<template>
	<div>
		<script id="editor" type="text/plain"></script>
	</div>
</template>
<style>
	@import url("../../../static/js/ueditor/themes/default/css/ueditor.css");
	#editor {
		margin-top: 20px;
	}
	
	.el-dialog--center {
		width: 50% !important;
	}
</style>
<script>
	import '../../../static/js/jquery/jquery.min.js';
	import '../../../static/js/ueditor/ueditor.config';
	import '../../../static/js/ueditor/ueditor.all';
	import '../../../static/js/ueditor/lang/zh-cn/zh-cn';
	import '../../../static/js/ueditor/ueditor.parse.min.js';
	export default {
		data() {
			return {
				editor: null,
				defaultValues: ""
			}
		},
		props: {
			'defaultValue': this.defaultValues,
			'config': {
				BaseUrl: '',
				UEDITOR_HOME_URL: '/static/js/ueditor/',
				toolbars: [
					['fullscreen', 'source', 'undo', 'redo'],
					['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
				]
			}

		},
		mounted() {
			var _this = this;
			this.getplacehodle();//调用模拟placehodle的方法
			this.editor = UE.getEditor('editor', this.config); // 初始化UE
			this.editor.placeholder("请输入邮件模版");//模拟placehodle的效果
			this.editor.addListener("ready", function() {
				_this.editor.setContent(_this.defaultValue || ""); // 确保UE加载完成后，放入内容。
			});
		},
		methods: {
			getUEContent() { // 获取内容方法
				return this.editor.getContent()
			},
			setUEContent(param) {
				var _this = this;
				_this.editor.setContent(param); // 确保UE加载完成后，放入内容。
			},
			getplacehodle() {
				UE.Editor.prototype.placeholder = function(justPlainText) {
					var _editor = this;
					_editor.addListener("focus", function() {
						var localHtml = _editor.getPlainTxt();
						if($.trim(localHtml) === $.trim(justPlainText)) {
							_editor.setContent(" ");
						}
					});
					_editor.addListener("blur", function() {
						var localHtml = _editor.getContent();
						if(!localHtml) {
							_editor.setContent('<span style="color:#C7C7Cd">' + justPlainText + '</span>');
						}
					});
					_editor.ready(function() {
						_editor.fireEvent("blur");
					});
				};
			},
		},
		destroyed() {
			this.editor.destroy();
		}
	}
</script>