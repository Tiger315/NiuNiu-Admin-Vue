<template>
<div>
<script id="editor" type="text/plain"></script>
</div>
</template>
<style scoped>
@import url("../../../static/js/ueditor/themes/default/css/ueditor.css");
#editor {
margin-top: 10px;
}
.el-dialog--center {
/* width: 50% !important; */
}
.el-form-item__content {
line-height: 20px;
}
</style>
<script>
import '../../../static/js/jquery/jquery.min.js'
import '../../../static/js/ueditor/ueditor.config'
import '../../../static/js/ueditor/ueditor.all'
import '../../../static/js/ueditor/lang/zh-cn/zh-cn'
import '../../../static/js/ueditor/ueditor.parse.min.js'
export default {
  data () {
    return {
      editor: null,
      useType: '',
      config: {
        BaseUrl: '',
        UEDITOR_HOME_URL: '/static/js/ueditor/',
        toolbars: [
          ['source', 'undo', 'redo', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall']
        ]
      }
    }
  },
  props: ['defaultValue', 'useTypes'],
  mounted () {
    var _this = this
    this.editor = window.UE.getEditor('editor', this.config) // 初始化UE
    this.editor.addListener('ready', function () {
      _this.editor.setContent(_this.defaultValue || '') // 确保UE加载完成后，放入内容。
      _this.editor.setHeight(_this.useTypes === '1' ? 260 : document.documentElement.clientHeight / 5)
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    },
    setUEContent (param) {
      var _this = this
      _this.editor.setContent(param) // 确保UE加载完成后，放入内容。
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>
