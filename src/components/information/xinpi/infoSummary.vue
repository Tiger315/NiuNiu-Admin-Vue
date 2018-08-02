<template>
  <div class="add-summary">
    <el-button type="primary" size="small" @click="centerDialogVisible=true;summaryForm.comment='';summaryForm.checked=false">添加</el-button>
    <div>
        <el-dialog title="编辑总结经验" :visible.sync="centerDialogVisible" width="30%" center>
          <el-form  label-width="100px" class="demo-ruleForm">
            <el-form-item label="" prop="title">
              <el-input type="textarea" v-model="summaryForm.comment"></el-input>
            </el-form-item>
            <el-form-item class="form_btn">
              <el-checkbox v-model="summaryForm.checked" class="set-private">设为私有</el-checkbox>
              <el-button type="primary" size="small">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
  </div>
</template>
<script>
export default {
  name: 'infoSummary',
  data () {
    return {
      'centerDialogVisible': false,
      'summaryForm': {
        comment: '',
        checked: false
      }
    }
  }

}
</script>
<style scoped>
.add-summary{
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}
.el-form-item__content{
  margin-left: 0px !important;
}
.el-form-item.form_btn{
  text-align: center;
}
.set-private{
  position: absolute;
  left: 0px;
}
</style>
