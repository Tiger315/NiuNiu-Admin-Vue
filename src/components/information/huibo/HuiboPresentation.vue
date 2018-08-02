<template>
    <div class="Huibo-box" v-cloak>
      <el-container style="margin-bottom: 10px;">
        <el-select v-model="sBox.zHuiboVal" collapse-tags size="small" style="width: 350px; margin-left: 20px;" placeholder="请选择研报栏目" filterable>
          <el-option v-for="item in sBox.zHuiboType" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-input placeholder="请输入标题, 包含以下关键词（以空格区分）" v-model="sBox.zHuiboTypeKeyWords" size="small" style="width: 350px; margin-left: 20px;" clearable></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 20px;" @click="getHuiboPresentation">搜索</el-button>
      </el-container>
    <!--表格开始-->
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zHuiboPresentationData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" width="70"></el-table-column>
      <el-table-column fixed="left" prop="title" label="标题" min-width="350" fit show-overflow-tooltip>
         <template slot-scope="scope">
          <span style="color: #0d308c; cursor: pointer; font" @click="seePresentationDialog(scope.row,1)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="publish" label="研报出处" fit></el-table-column>
      <el-table-column prop="ztype" label="研报栏目" fit></el-table-column>
      <el-table-column prop="doc_pages" label="研报页数" fit></el-table-column>
       <el-table-column prop="author" label="研报作者" fit></el-table-column>
      <el-table-column prop="grade" label="评级" fit></el-table-column>
      <el-table-column prop="create_date" label="分享时间" fit></el-table-column>
      <el-table-column fixed="right" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="editHuibo(scope.row,scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteHuibo(scope.row,scope.row.id)">删除</el-button>
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

    <!--查看明细dialog开始-->
    <el-dialog :title="zDetail.title" :visible.sync="zDialog" style="font-weight: bold;" fullscreen>
      <div class="dialog-box" v-loading="zLoading">
        <el-row style="font-size: 14px; color: #717171;">
          <el-col :span="16">
            <div class="grid-content" style="text-align: left;">
              <span class="ssp">{{zDetail.ztype}}</span>
              <span class="ssp">{{zDetail.publish}}</span>
              <span class="ssp">{{zDetail.author}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content" style="text-align: right;">
              <span class="ssp">{{zDetail.creatDate}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="24" style="height: 470px; min-height: 470px; overflow: auto;">
            <div v-html="zDetail.content" style="margin-left: 10px;" class="nOnly"></div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px; background: #FAFAFA; border: 1px solid #DBDBDB;">
          <el-col :span="24">
            <div style="font-weight: bold; font-size: 13px; color: #303133; margin: 5px; border-bottom: 1px solid #DBDBDB;">
              <i class="el-icon-document" style="margin-right: 5px;"></i>附件
              <span class="nsm">({{ zDetail.attchementTotal }} 个)</span>
            </div>
            <div style="margin: 5px 5px 0px 5px; height: 60px; max-height: 60px; overflow: auto;">
              <el-row>
                <el-col :span="8" v-for="att in zDetail.attachementData" :key="att.id">
                  <el-row>
                    <el-col style="text-align: left;">
                      <a :href="att.att_url" style="color: #0d308c; font-size: 13px;" :title="att.old_name">{{att.name}}</a>
                      <span class="nsm" style="margin-left: 3px;">({{att.size}})</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button type="primary" @click="zDialog = false" size="small" icon="el-icon-circle-close-outline">关 闭</el-button>
        </el-button-group>
      </span>
    </el-dialog>
    <!--查看明细dialog结束-->

    <!--编辑明细dialog开始-->
    <el-dialog  :visible.sync="zEditDialog" style="font-weight: bold;" fullscreen>
       <el-form ref="zDetail" :model="zDetail" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="标题" prop="title" class="form-item">
            <el-input placeholder="请输入标题" v-model="zDetail.title" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研报栏目" prop="zTypeVal" class="form-item">
             <el-select v-model="zDetail.ztype" collapse-tags size="small" style="width: 350px; " placeholder="请选择研报栏目" filterable>
              <el-option v-for="item in sBox.zHuiboType" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="研报出处" prop="publish" class="form-item">
            <el-input placeholder="请输入研报出处" v-model="zDetail.publish" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="研报作者" prop="author" class="form-item">
             <el-input placeholder="请输入研报作者" v-model="zDetail.author" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="评级" prop="grade" class="form-item">
            <el-input placeholder="请输入评级" v-model="zDetail.grade" size="small" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细内容" prop="content" class="form-item">
            <li-ueditor ref="ueditor" :default-value='zDetail.content' use-types="1"></li-ueditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;">
          <el-form-item style="margin-bottom: 0px;">
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-edit" id="btnUpdateLaw" @click="sureEdit">修改</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </el-dialog>
    <!--编辑明细dialog结束-->
  </div>
</template>
<script>
import ueditor from '../../commen/Ueditor.vue'
export default {
  name: 'HuiboPresentation',
  components: {
    'li-ueditor': ueditor
  },
  data () {
    return {
      tHeight: document.documentElement.clientHeight - 93,
      zLoading: true,
      zHuiboPresentationData: [],
      sBox: {
        zHuiboType: [
          '并购重组', '晨会早刊', '港台研究', '公司调研', '股指期货',
          '宏观经济', '机构资讯', '基金频道', '金融工程', '期货研究', '期权研究',
          '融资融卷', '投资策略', '投资组合', '外汇研究', '新股研究', '行业分析', '债券研究'
        ],
        zHuiboVal: '',
        zHuiboTypeKeyWords: ''
      },
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      },
      zDetail: {
        title: '',
        id: '',
        author: '',
        content: '',
        creatDate: '',
        publish: '',
        ztype: '',
        grade: '',
        attchementTotal: 0,
        attachementData: []
      },
      zDialog: false,
      zEditDialog: false,
      prensentForm: {},
      rules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }],
        zTypeVal: [{
          required: true,
          message: '请选择研报栏目',
          trigger: 'blur'
        }],
        publish: [{
          required: true,
          message: '请输入研报栏目',
          trigger: 'blur'
        }],
        author: [{
          required: true,
          message: '请输入研报作者',
          trigger: 'blur'
        }],
        grade: [{
          required: false,
          message: '请输入评级',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }]
      }
    }
  },
  props: ['defaultValue', 'useTypes'],
  methods: {
    seePresentationDialog (row, flag) {
      this.zLoading = true
      if (row) {
        this.zDetail.title = row.title
        this.zDetail.id = row.id
        this.zDetail.author = row.author
        this.zDetail.content = row.content
        this.zDetail.creatDate = row.create_date
        this.zDetail.publish = row.publish
        this.zDetail.ztype = row.ztype
        this.zDetail.grade = row.grade
        // this.getLawAttachement(row.ID)
      }
      this.zLoading = false
      if (flag) { // 标记是查看明细
        this.zDialog = true
      }
    },
    getHuiboPresentation () {
      var that = this
      var pageNum = that.zPager.currentPage
      var pageSize = that.zPager.size
      var ztype = encodeURI(that.sBox.zHuiboVal)// 查询类型
      var title = encodeURI(that.sBox.zHuiboTypeKeyWords)// 查询关键字
      var apiPath = ''
      if (ztype || title) {
        var ztypeHtml = '/' + (ztype || 'def')
        var titleHtml = '/' + (title || 'def')
        apiPath = that.apiPath + 'HB_Yjbg/Pager/' + pageNum + '/' + pageSize + ztypeHtml + titleHtml
      } else {
        apiPath = that.apiPath + 'HB_Yjbg/Pager/' + pageNum + '/' + pageSize
      }

      that.$ajax
        .get(apiPath)
        .then(function (response) {
          var res = response.data
          if (res.Code === 1000) {
            that.zHuiboPresentationData = res.Result.Data
            that.zPager.total = res.Result.Total
          }
          that.zLoading = false
        })
        .catch(function (response) {})
    },
    pagerChange (val) {
      this.getHuiboPresentation()
    },
    editHuibo (row, id) {
      this.zEditDialog = true
      this.seePresentationDialog(row)
      if (this.$refs.ueditor) {
        this.$refs.ueditor.setUEContent(this.zDetail.content)
      }
    },
    // 确定编辑慧博研究报告
    sureEdit () {
      var that = this
      var apiPath = that.apiPath + 'HB_Yjbg'
      // 获取富文本框修改的内容
      that.zDetail.content = this.$refs.ueditor.getUEContent()
      that.$ajax
        .put(apiPath, that.zDetail)
        .then(function (response) {
          var res = response.data
          if (res.Code === 1000) {
            // 编辑成功更新视图
            for (var i = 0; i < that.zHuiboPresentationData.length; i++) {
              if (that.zHuiboPresentationData[i].id === that.zDetail.id) {
                for (var key in that.zDetail) {
                  that.zHuiboPresentationData[i][key] = that.zDetail[key]
                }
              }
            }
            // 删除成功提示
            that.$message({
              message: '编辑成功',
              type: 'success'
            })
          }
        })
    },
    // 删除慧博研究报告
    deleteHuibo (row, id) {
      var that = this
      var apiPath = that.apiPath + 'HB_Yjbg/' + id
      that.$confirm('此操作将永久删除此条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$ajax
          .delete(apiPath)
          .then(function (response) {
            var res = response.data
            if (res.Code === 1000) {
              // 删除成功更新视图
              that.zHuiboPresentationData = that.zHuiboPresentationData.filter(a => a['id'] !== id)
              // 修改总数
              that.zPager.total--
              // 删除成功提示
              that.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除操作...'
          })
        })
    }
  },
  created () {
    this.getHuiboPresentation()
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 93
      })()
    }
  }

}
</script>
<style scoped>
.ssp {
    padding: 0 5px;
    border-right: 1px solid #717171;
    font-weight: bold;
}
.ssp:last-of-type{
  border: none;
}
</style>
