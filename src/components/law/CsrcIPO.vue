<template>
  <div class="LawList-box" v-cloak>
    <!--表格开始-->
    <el-table v-loading="zLoading" element-loading-text="拼命加载中" :data="zLawData" :height="tHeight" stripe style="width: 100%;" empty-text=" " row-key="id">
      <el-table-column type="index" fixed="left" width="70" :index="typeIndex"></el-table-column>
      <el-table-column fixed="left" prop="title" label="标题" min-width="350" fit show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: #0d308c; cursor: pointer; font" @click="seeLawDialog(scope.row)">{{ scope.row.Title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Issue_Date" label="发布日期" width="120"></el-table-column>
    </el-table>
    <!--表格结束-->

    <!--分页开始-->
    <div style="margin-top: 10px; height: 32px; line-height: 32px; text-align: center;">
      <span style="float: left; text-align: right; color: #606266; font-size: 14px; padding-top: 3px;">共 {{ zPager.total }} 条</span>
      <el-pagination layout="prev, pager, next" :page-size="zPager.size" :pager-count="zPager.count" :current-page.sync="zPager.currentPage" :total="zPager.total" @current-change="pagerChange">
      </el-pagination>
    </div>
    <!--分页结束-->

    <!--dialog开始-->
    <el-dialog :title="zCurLaw.title" :visible.sync="zDialog" style="font-weight: bold;" fullscreen="true">
      <div class="dialog-box" v-loading="zLoading">
        <el-row style="font-size: 14px; color: #717171;">
          <el-col :span="16">
            <div class="grid-content" style="text-align: left;">
              <span class="ssp">{{zCurLaw.organization}}</span>
              <span class="ssp">{{zCurLaw.type}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content" style="text-align: right;">
              <span class="ssp">{{zCurLaw.Issue_Date}}</span>
              <span class="ssp">{{zCurLaw.sign}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="4">
            <el-menu collapse="true" style="width: 100%; height: 470px; max-height: 470px; overflow: auto;">
              <template v-for="nZ in zCurLaw.navigation">
                <el-submenu :index="nZ.id" :key="nZ.id">
                  <template slot="title">
                    <a :href="'#' + nZ.id" class="el-menu-a">
                      <i>{{ nZ.name }}</i>
                    </a>
                    <span>{{ nZ.name }}</span>
                  </template>
                  <template v-if="nZ.j !== undefined">
                    <template v-for="nJ in nZ.j">
                      <el-menu-item-group :key="nJ.id">
                        <template slot="title">{{ nJ.name }}</template>
                        <template v-for="nT in nJ.t">
                          <el-menu-item :index="nT.id" :key="nT.id">
                            <a :href="'#' + nT.id" class="el-menu-a">{{ nT.name }}</a>
                          </el-menu-item>
                        </template>
                      </el-menu-item-group>
                    </template>
                  </template>
                  <template v-else>
                    <el-menu-item-group v-for="nT in nZ.t" :key="nT.id">
                      <el-menu-item :index="nT.id">
                        <a :href="'#' + nT.id" class="el-menu-a">{{ nT.name }}</a>
                      </el-menu-item>
                    </el-menu-item-group>
                  </template>
                </el-submenu>
              </template>
            </el-menu>
          </el-col>
          <el-col :span="20" style="height: 470px; max-height: 470px; overflow: auto;">
            <div v-html="zCurLaw.content" style="margin-left: 10px;" class="nOnly"></div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px; background: #FAFAFA; border: 1px solid #DBDBDB;">
          <el-col :span="24">
            <div style="font-weight: bold; font-size: 13px; color: #303133; margin: 5px; border-bottom: 1px solid #DBDBDB;">
              <i class="el-icon-document" style="margin-right: 5px;"></i>附件
              <span class="nsm">({{ zCurLaw.attchementTotal }} 个)</span>
            </div>
            <div style="margin: 5px 5px 0px 5px; height: 60px; max-height: 60px; overflow: auto;">
              <el-row>
                <el-col :span="8" v-for="att in zCurLaw.attachementData" :key="att.id">
                  <el-row>
                    <el-col style="text-align: left;">
                      <a :href="'http://sign.niuniu.com:8814/'+att.att_url" style="color: #0d308c; font-size: 13px;" :title="att.old_name">{{att.name}}</a>
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
          <el-button type="primary" @click="dialog = false" size="small" icon="el-icon-circle-close-outline">关 闭</el-button>
        </el-button-group>
      </span>
    </el-dialog>
    <!--dialog结束-->
  </div>
</template>

<script>
export default {
  name: 'LawList',
  data() {
    return {
      tHeight: document.documentElement.clientHeight - 135,
      isDefOrSearch: 0,
      zLoading: true,
      sBox: {
        zLawTypeProps: {
          value: 'Name',
          label: 'Name',
          children: 'Child'
        },
        zLawWjProps: {
          value: 'Name',
          label: 'Name',
          children: 'Child'
        },
      },
      zLawData: [],
      zPager: {
        total: 0,
        size: 30,
        count: 11,
        currentPage: 1
      },
      zCurLaw: {
        id: '',
        title: '法律法规详情',
        Issue_Date: '1900-00-00',
        organization:"",
        sign:"",
        topic_Word:"",
        type:"",
        content:"",
        attchementTotal: 0,
        attachementData: []
      },
      zDialog: false,
      zEditDialog: false,
      zEditUrl: '#'
    }
  },
  methods: {
    typeIndex(index) {
      return index + (this.zPager.currentPage - 1) * this.zPager.size + 1
    },

    getLaw() {
      const that = this
      that.zLoading = true
      let pageNum = that.zPager.currentPage
      let pageSize = that.zPager.size
      let apiPath =
        that.apiPath +
        'CsrcIPO?page=' +
        pageNum +
        '&per_page=' +
        pageSize

      that.$ajax
        .get(apiPath)
        .then(function(response) {
          let res = response.data
          if (res.Code === 1000) {
            that.zLawData = res.Result.Data
            that.zPager.total = res.Result.Total
          }
          that.zLoading = false
        })
        .catch(function(response) {
        })
    },
    pagerChange(val) {
      this.getLaw()
    },
    seeLawDialog(row) {
      this.zLoading = true
      if (row) {
        this.zCurLaw.title = row.Title
        this.zCurLaw.id = row.ID
        console.log(row.ID)
        this.zCurLaw.Issue_Date = row.Issue_Date
        this.zCurLaw.sign = row.Sign
        this.zCurLaw.content = row.Content
        this.zCurLaw.organization = row.Organization
        this.zCurLaw.topic_Word = row.Topic_Word
        this.zCurLaw.type = row.Type
 				this.getLawAttachement(row.ID)
      }
      this.zLoading = false
      this.zDialog = true
    },
    getLawAttachement(id) {
      const that = this
      let apiPath = that.apiPath + 'CsrcIPOAttr/' + id

      that.$ajax
        .get(apiPath)
        .then(function(response) {
          let res = response.data
          that.zCurLaw.attchementTotal = res.Result.Total
          that.zCurLaw.attachementData = res.Result.Data
        })
        .catch(function(response) {
          console.log(response)
        })
    },
 
  },
  created() {
    this.getLaw()
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        that.tHeight = document.documentElement.clientHeight - 135
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
html,
body {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
.ssp {
  padding: 0 5px;
  border-right: 1px solid #717171;
  font-weight: bold;
}
.ssp:last-child {
  border: none;
}
a {
  text-decoration: none;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}
.el-menu-item {
  height: 18px;
  line-height: 18px;
  color: #606266;
}
.el-submenu__title {
  height: 32px;
  line-height: 32px;
  color: #606266;
}
.el-submenu__title i {
  color: #606266;
  font-style: normal;
}
.el-menu-a {
  color: #0d308c;
  font-size: 13px;
}
</style>
