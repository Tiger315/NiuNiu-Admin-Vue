<template>
  <div class="law-list-wpf-box" v-cloak>
    <!--搜索开始-->
    <el-container style="margin-bottom: 10px;">
      <el-cascader placeholder="请选择业务类别" :options="searchBox.zLawTypeData" v-model="searchBox.zLawTypeVal" @change="searchBox.lawTypeChange" size="small" style="width: 350px;" :props="searchBox.zLawTypeProps" filterable clearable></el-cascader>
      <el-cascader placeholder="请选择法律位阶" :options="searchBox.zLawWjData" v-model="searchBox.zLawWjVal" @change="searchBox.lawWjChange" size="small" style="width: 350px; margin-left: 20px;" :props="searchBox.zLawWjProps" filterable clearable></el-cascader>
      <el-select v-model="searchBox.zLawScopeVal" multiple collapse-tags size="small" style="width: 350px; margin-left: 20px;" placeholder="请选择适用范围" filterable>
        <el-option v-for="item in searchBox.zLawScopeData" :key="item.id" :label="item.name" :value="item.name"></el-option>
      </el-select>
      <el-select v-model="searchBox.zLawSourceVal" multiple collapse-tags size="small" style="width: 350px; margin-left: 20px;" placeholder="请选择发文单位" filterable>
        <el-option v-for="item in searchBox.zLawSourceData" :key="item.id" :label="item.name" :value="item.name"></el-option>
      </el-select>
    </el-container>
    <el-container style="margin-bottom: 10px;">
      <el-input placeholder="请输入标题, 包含以下全部关键词（以空格区分）" v-model="zLawT1Val" size="small" style="width: 350px;" clearable></el-input>
      <el-input placeholder="请输入标题, 包含以下任意关键词（以空格区分）" v-model="zLawT2Val" size="small" style="width: 350px; margin-left: 20px;" clearable></el-input>
      <el-input placeholder="请输入标题, 不包含以下关键词（以空格区分）" v-model="zLawT3Val" size="small" style="width: 350px; margin-left: 20px;" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 20px;" @click="btnSearch">搜索</el-button>
    </el-container>
    <!--搜索开始-->

    <!--表格开始-->
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zLawData.slice((zPage.zCurrentPage - 1) * zPage.zSize, zPage.zCurrentPage * zPage.zSize)"
      :height="cHeight" stripe style="width: 100%;" highlight-current-row empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" style="min-width: 400px;"></el-table-column>
      <el-table-column fixed="left" prop="title" label="标题" fit show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click.native.prevent="seeLawDialog(scope.row)" style="color: #0d308c;">{{ scope.row.title }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="law_wj_name" label="法律位阶" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="law_scope_name" label="适用范围" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="source_place" label="发文单位" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="重要性" width="150">
        <template slot-scope="scope">
          <el-rate v-model="scope.row.grade" disabled :show-score="false"></el-rate>
        </template>
      </el-table-column>
      <el-table-column prop="valid_flag" label="生效状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.valid_flag === 1 ? 'primary' : 'danger'" close-transition>{{scope.row.valid_flag === 1 ? '现行有效' : '已失效'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publish_date" label="发布日期" width="120"></el-table-column>
    </el-table>
    <!--表格结束-->

    <!--分页开始-->
    <div style="margin-top: 10px; height: 32px; line-height: 32px; text-align: center;">
      <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPage.zTotal }} 条</span>
      <el-pagination layout="prev, pager, next" :page-size="zPage.zSize" :pager-count="zPage.zCount" :current-page.sync="zPage.zCurrentPage"
        :total="zPage.zTotal" @current-change="pageChange">
      </el-pagination>
    </div>
    <!--分页结束-->

    <!--dialog开始-->
    <el-dialog :title="curLaw.zTitle" :visible.sync="dialog" style="font-weight: bold;" width="95%" top="5vh">
      <div>
        <iframe :src="dialogUrl" width="100%" height="725px" frameborder="0"></iframe>
      </div>
    </el-dialog>
    <!--dialog结束-->
  </div>
</template>

<script>
export default {
  name: 'LawListWpf',
  data () {
    return {
      cHeight: document.documentElement.clientHeight - 135,
      searchBox: {
        zLawTypeData: [],
        zLawWjData: [],
        zLawScopeData: [],
        zLawSourceData: [],
        zLawTypeVal: '',
        zLawWjVal: '',
        zLawScopeVal: '',
        zLawSourceVal: '',
        zLawT1Val: '',
        zLawT2Val: '',
        zLawT3Val: '',
        zLawTypeProps: {
          value: 'Name',
          label: 'Name',
          children: 'Child'
        },
        zLawWjProps: {
          value: 'Name',
          label: 'Name',
          children: 'Child'
        }
      },
      zLoading: true,
      zLawData: [],
      zPage: {
        zTotal: 0,
        zSize: 30,
        zCount: 11,
        zCurrentPage: 1
      },
      curLaw: {
        zTitle: '法律法规详细内容'
      },
      dialog: false,
      dialogUrl: '#'
    }
  },
  methods: {
    getLawType () {
      const that = this
      that.getData('LawType', true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.searchBox.zLawTypeData = result.Data
          }
        }
      })
    },
    lawTypeChange (value) {
      this.searchBox.zLawTypeVal = value
    },
    getLawWj () {
      const that = this
      that.getData('LawWj', true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.searchBox.zLawWjData = result.Data
          }
        }
      })
    },
    lawWjChange (value) {
      this.searchBox.zLawWjVal = value
    },
    getLawScope () {
      const that = this
      that.getData('LawScope', true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.searchBox.zLawScopeData = result.Data
          }
        }
      })
    },
    getLawSource () {
      const that = this
      that.getData('LawSource', true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.searchBox.zLawSourceData = result.Data
          }
        }
      })
    },
    getLaw () {
      const that = this
      that.getData('Law', true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.zLawData = result.Data
            that.zPage.zTotal = result.Total
            that.zLoading = false
          }
        }
      },
      function () {
        that.zLoading = false
      })
    },
    getLawBySearch (t1, t2, t3, t4, t5, t8, t9) {
      const that = this
      that.getData('Law' + '/' + t1 + '/' + t2 + '/' + t3 + '/' + t4 + '/' + t5 + '/' + t8 + '/' + t9, true,
        function (res) {
          if (res.Code === 1000) {
            var result = res.Result
            that.zLawData = result.Data
            that.zPage.zTotal = result.Total
            that.zLoading = false
          }
        },
        function () {
          that.zLoading = false
        })
    },
    btnSearch () {
      this.zLoading = true
      var t1 = this.searchBox.zLawT1Val.trim() === '' ? '[]' : this.searchBox.zLawT1Val
      var t2 = this.searchBox.zLawT2Val.trim() === '' ? '[]' : this.searchBox.zLawT2Val
      var t3 = this.searchBox.zLawT3Val.trim() === '' ? '[]' : this.searchBox.zLawT3Val
      var t4 = this.searchBox.zLawWjVal[1] === undefined ? '[]' : this.searchBox.zLawWjVal[0] + '|' + this.searchBox.zLawWjVal[1]
      var t5 = this.searchBox.zLawTypeVal[1] === undefined ? '[]' : this.searchBox.zLawTypeVal[1]
      var t8 = this.searchBox.zLawScopeVal.length === 0 ? '[]' : this.searchBox.zLawScopeVal
      var t9 = this.searchBox.zLawSourceVal.length === 0 ? '[]' : this.searchBox.zLawSourceVal
      this.getLawBySearch(t1, t2, t3, t4, t5, t8, t9)
    },
    seeLawDialog (row) {
      //  + encodeURI(JSON.stringify(row))
      this.curLaw.zTitle = row.title
      this.dialogUrl = '#/Law/LawListWpfDet?row=' + encodeURI(JSON.stringify(row))
      this.dialog = true
    }
  },
  created () {
    this.getLawType()
    this.getLawWj()
    this.getLawScope()
    this.getLawSource()
    this.getLaw()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.cHeight = document.documentElement.clientHeight - 135
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
</style>
