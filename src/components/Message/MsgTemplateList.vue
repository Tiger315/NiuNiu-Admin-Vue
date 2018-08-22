<template>
  <div class="MsgTemplateList-box" v-cloak>
    <!--表格开始-->
    <div class="add_btn">
      <div class="buttons"> <el-button type="primary" @click="initModal" size="small">新增短信模板</el-button></div>

      <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="mailData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
        <el-table-column type="index" fixed="left" width="70" label="序号" :index="typeIndex"></el-table-column>
        <el-table-column prop="id" fixed="left" width="350" label="ID"></el-table-column>
        <el-table-column prop="content" fit show-overflow-tooltip label="内容"></el-table-column>
        <el-table-column fixed="right" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="editMsgTemplate(scope.row,scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteMsgTemplate(scope.row,scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页开始-->
      <div style="margin-top: 10px; height: 32px; line-height: 32px; text-align: center;">
        <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPager.total }} 条</span>
        <el-pagination layout="prev, pager, next" :page-size="zPager.size" :pager-count="zPager.count" :current-page.sync="zPager.currentPage" :total="zPager.total" @current-change="pagerChange">
        </el-pagination>
      </div>
      <div>
        <el-dialog :title="isEditDialog == 1? '新增短信模板' : '编辑短信模板'" :visible.sync="addMail.centerDialogVisible"  center>
          <el-form :model="addMail.msg_model" :rules="addMail.rules" ref="addMail.msg_model" label-width="100px" class="demo-ruleForm">
            <el-form-item label="短信内容" prop="Content">
              <textarea name="Content" id="Content" cols="30" rows="10" v-model="addMail.msg_model.Content"></textarea>
            </el-form-item>
            <el-form-item class="form_btn">
              <el-button @click="addMail.centerDialogVisible = false"  size="small">取 消</el-button>
              <el-button type="primary" @click="isValid('addMail.msg_model')"  size="small">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
    <!--表格结束-->
    </div>
  </template>
<script>
import ueditor from '../commen/Ueditor.vue'
export default {
  name: 'MsgTemplateList',
  data () {
    return {
      tHeight: document.documentElement.clientHeight - 82,
      zLoading: true,
      mailData: [],
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      },
      addMail: {
        centerDialogVisible: false,
        msg_model: {
          Content: '',
          ID: ''
        },
        rules: {
          msg_moDel: [
            {
              required: true,
              message: '请输入短信内容'
            }
          ]
        }
      },
      isEditDialog: 1, // 判断弹框是编辑还是新增的，1新增，2编辑
      clickedIdx: 0 // 记录当前点击编辑或者删除的下标
    }
  },
  components: {
    'li-ueditor': ueditor
  },
  props: ['defaultValue'],
  methods: {
    typeIndex (index) {
      return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
    },
    // 获取列表
    getMail () {
      var that = this
      that.zLoading = true
      var apiPath = that.apiPath + '/MessageTemplate'
      that.$ajax
        .get(apiPath)
        .then(function (response) {
          let res = response.data
          if (res.Code === 1000) {
            that.mailData = res.Result.Data
            that.zPager.total = res.Result.Total
          }
          that.zLoading = false
        })
        .catch(function (response) {})
    },
    // 点击新增短信模板按钮打开弹框并且初始化弹框中内容
    initModal () {
      this.addMail.centerDialogVisible = true
      this.isEditDialog = 1
      this.addMail.msg_model.Content = ''
    },
    // 验证是否可以提交
    isValid (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addMailTemplate()
        }
      })
    },
    // 点击弹框中确定按钮，新增或者编辑模板
    addMailTemplate (formName) {
      var that = this
      var addEmailParam = {
        Content: this.addMail.msg_model.Content,
        ID: this.addMail.msg_model.ID
      }
      this.addMail.centerDialogVisible = false
      var apiPath = that.apiPath + 'MessageTemplate'
      if (this.isEditDialog === 1) { // 新增
        delete addEmailParam.ID
        that.$ajax
          .post(apiPath, that.addMail.msg_model)
          .then(function (response) {
            let res = response.data
            if (res.Code === 1000) {
              addEmailParam.Id = res.Result.Data
              // 向数组最前面插入新增的这条数据
              that.mailData.unshift({'content': that.addMail.msg_model.Content, 'id': addEmailParam.Id})
              that.$message({
                message: '添加短信模板成功',
                type: 'success'
              })
            }
            that.zLoading = false
          })
          .catch(function (response) {})
      } else if (this.isEditDialog === 2) { // 编辑
        that.$ajax
          .put(apiPath, that.addMail.msg_model)
          .then(function (response) {
            let res = response.data
            if (res.Code === 1000) {
              // 更改本条记录
              that.mailData[that.clickedIdx].content = addEmailParam.Content
              that.$message({
                message: '修改短信模板成功',
                type: 'success'
              })
            }
            that.zLoading = false
          })
          .catch(function (response) {})
      }
    },
    // 点击编辑按钮
    editMsgTemplate (param, index) {
      this.clickedIdx = index
      this.isEditDialog = 2
      this.addMail.centerDialogVisible = true
      this.addMail.msg_model.Content = param.content
      this.addMail.msg_model.ID = param.id
    },
    // 点击删除按钮
    deleteMsgTemplate (row, id) {
      const that = this
      this.$confirm('此操作将永久删除此条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var apiPath =
            that.apiPath + 'MessageTemplate/' + id
          that.$ajax
            .delete(apiPath)
            .then(function (response) {
              let res = response.data
              if (res.Code === 1000) {
                // 删除这条数据
                that.mailData = that.mailData.filter(a => a['id'] !== id)
                // 修改总数
                that.zPager.total--
                // 隐藏弹框
                that.$message({
                  message: '删除短信模板成功',
                  type: 'success'
                })
              }
              that.zLoading = false
            })
            .catch(function (response) {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作...'
          })
        })
    },
    pagerChange (val) {
      this.getMail()
    }
  },
  created () {
    this.getMail()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 82
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
textarea{
  width: 100%;
  border: 1px solid #ccc;
}
html,
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.add_btn>.buttons{
  width: 100%;
text-align: right;
}
.mail-textarea {
  margin-top: 20px;
}

.form_btn {
  margin-right: 100px !important;
  margin-bottom: 0px !important;
  text-align: center;
}
</style>
