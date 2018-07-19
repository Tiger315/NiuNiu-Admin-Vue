<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row   style="width: 100%">
      <el-table-column  type="index" label="序号" width="50"></el-table-column>
      <el-table-column property="file" label="文件" ></el-table-column>
      <el-table-column property="newspaper" label="登报"></el-table-column>
      <el-table-column property="net" label="上网"> </el-table-column>
      <el-table-column property="Preparation" label="报备"> </el-table-column>
      <el-table-column property="neccessary" label="必备"> </el-table-column>
      <el-table-column property="type" label="所属公告类别"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'infoFile',
  data () {
    return {
      tableData: [{
        file: '文件',
        newspaper: '登报',
        net: '上网',
        Preparation: '报备',
        neccessary: '必备',
        type: '所属公告类别'
      }]
    }
  }
}
</script>
<style>

</style>
