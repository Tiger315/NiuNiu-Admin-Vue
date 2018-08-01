<template>
  <div>
    <div>
      <el-table ref="singleTable" :data="tableData" highlight-current-row   style="width: 100%">
        <el-table-column  type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="法规名称"  min-width="350" fit show-overflow-tooltip>
                <template slot-scope="scope">
                    <span style="cursor:pointer">{{scope.row.lawName}}</span>
                    <span class="blue">{{scope.row.count==0?'(条文阅读)':('(精准阅读'+scope.row.count+'条)')}}</span>
                </template>
        </el-table-column>
        <el-table-column property="published" label="颁布时间"></el-table-column>
        <el-table-column property="typeName" label="法律位阶"> </el-table-column>
        <el-table-column property="sourceDepartment" label="发文单位"> </el-table-column>
        <el-table-column label="重要性">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.lawGrade" disabled :show-score="false"></el-rate>
          </template>
       </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'infoLaw',
  data () {
    return {
      tableData: [{
        count: 1,
        lawGrade: 3,
        lawId: '746126805380594909',
        lawInvalid: '',
        lawItemList: null,
        lawName: '公开发行证券的公司信息披露编报规则第19号——财务信息的更正及相关披露(2018年修订)',
        lawStatus: '0',
        nodeId: null,
        published: '2018-04-24',
        sourceDepartment: '中国证券监督管理委员会',
        typeId: '24181902543261879',
        typeName: '编报规则'
      }]
    }
  }
}
</script>
<style>
.blue{
  color: #409EFF;
  cursor: pointer;
}
</style>
