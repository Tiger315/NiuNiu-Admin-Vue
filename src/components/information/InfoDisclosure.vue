<template>
  <div class="Info-box" v-cloak>
    <!-- <div class="search-box">
        <el-cascader placeholder="请输入公告关键词"  size="small" style="width:50%;" filterable clearable></el-cascader>
    </div> -->
    <div class="data-show">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="信息披露文件" name="infoFile">
        <info-file></info-file>
      </el-tab-pane>
      <el-tab-pane label="披露要点" name="infoMain">
        <info-title :pass-time='this.passTime'></info-title>
        <info-main></info-main>
      </el-tab-pane>
      <el-tab-pane label="报批材料" name="infoMaterial">
        <info-title :pass-time='this.passTime'></info-title>
        <info-material></info-material>
      </el-tab-pane>
      <el-tab-pane label="法律法规" name="infoLaw">
        <info-title :pass-time='this.passTime'></info-title>
        <info-law></info-law>
      </el-tab-pane>
      <el-tab-pane label="经验总结" name="infoSummary">
        <info-title :pass-time='this.passTime'></info-title>
        <info-summary></info-summary>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>
<script>
import infoTitle from './infoTitle.vue'
import infoFile from './infoFile.vue'
import infoMain from './infoMain.vue'
import infoMaterial from './infoMaterial.vue'
import infoLaw from './infoLaw.vue'
import infoSummary from './infoSummary.vue'
export default {
  name: 'InfoDisclosure',
  data () {
    return {
      activeName2: 'infoFile',
      passTime: '半年度',
      props: ['passTime']
    }
  },
  components: {
    'info-title': infoTitle,
    'info-file': infoFile,
    'info-main': infoMain,
    'info-material': infoMaterial,
    'info-law': infoLaw,
    'info-summary': infoSummary

  },
  methods: {
    handleClick (tab, event) {
    }
  }
}
</script>

<style>
.el-collapse-item__header {
  font-size: 15px;
  font-weight: 700;
  font-family: "microsoft yahei";
}
.el-collapse-item__header.is-active,
.el-collapse-item__wrap {
  background-color: #fafafa;
}
.search-box{
 margin-bottom: 20px;
}
.el-tabs__nav{
  float: right;
}

</style>
