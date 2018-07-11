<template>
	<div>
		<script id="editor" type="text/plain"></script>
	</div>
</template>
<style>
	@import url("../../../static/js/ueditor/themes/default/css/ueditor.css");
	#editor {
		margin-top: 10px;
	}
	
	.el-dialog--center {
		width: 50% !important;
	}
	
	.el-form-item__content {
		line-height: 20px;
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
				defaultValues: "",
				config: {
					BaseUrl: '',
					UEDITOR_HOME_URL: '/static/js/ueditor/',
					toolbars: [
						['fullscreen', 'source', 'undo', 'redo'],
						['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall']
					]
				}
			}
		},
		props: {
			'defaultValue': this.defaultValues
		},
		mounted() {
			var _this = this;
			this.editor = UE.getEditor('editor', this.config); // 初始化UE
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
			}
		},
		destroyed() {
			this.editor.destroy();
		}
	}
</script>