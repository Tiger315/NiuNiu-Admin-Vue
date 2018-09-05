<template>
  <div class="index-box">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="24" style="font-size: 20px;padding-left:20px;">
            牛牛数据后台管理系统
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="250px">
          <el-menu default-active="1">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>法律法规管理</span>
              </template>
              <el-menu-item index="1-1" @click="addTab('新增法律法规','./static/pages/Law/law_add.html')">新增法律法规</el-menu-item>
              <el-menu-item index="1-2" @click="addTab('法律法规列表','./#/Law/LawList')">法律法规列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>邮件管理</span>
              </template>
              <el-menu-item index="2-1" @click="addTab('邮件模板','./#/Mail/MailTemplateList')">邮件模板</el-menu-item>
              <el-menu-item index="2-2" @click="addTab('邮件发送状态','./#/Mail/MailStatus')">邮件发送状态</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>短信管理</span>
              </template>
              <el-menu-item index="5-1" @click="addTab('短信模板','./#/Message/MsgTemplateList')">短信模板</el-menu-item>
              <el-menu-item index="5-2" @click="addTab('短信发送状态','./#/Message/MsgStatus')">短信发送状态</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>爬虫数据</span>
              </template>
              <el-menu-item index="1-3" @click="addTab('IPO实时列表','./#/Info/CsrcIPO')">IPO实时列表</el-menu-item>
              <el-menu-item index="3-1" @click="addTab('信披智库','./#/Info/InfoDisclosure')">信披智库</el-menu-item>
              <el-menu-item index="3-1" @click="addTab('慧博研究报告','./#/Info/HuiboPresentation')">慧博研究报告</el-menu-item>
              <el-menu-item index="3-1" @click="addTab('慧博研究报告','./#/Info/managers')">公司管理人员信息</el-menu-item>
              <el-submenu index="1-4">
                <template slot="title">金眼舆情系统</template>
                <el-menu-item index="1-4-1"  @click="addTab('监管动态','./#/yuqing/supervisionType')">监管动态</el-menu-item>
                <el-menu-item index="1-4-2"  @click="addTab('违规案例','./#/yuqing/IrregularitiesType')">违规案例</el-menu-item>
                <el-menu-item index="1-4-3"  @click="addTab('监管函件','./#/yuqing/feedback')">监管函件</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>报表中心</span>
              </template>
              <el-menu-item index="4-1" @click="addTab('报表1','#')">报表1</el-menu-item>
              <el-menu-item index="4-2" @click="addTab('报表2','#')">报表2</el-menu-item>
              <el-menu-item index="4-3" @click="addTab('报表3','#')">报表3</el-menu-item>
              <el-menu-item index="4-4" @click="addTab('报表4','#')">报表4</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-tabs v-model="editableTabsValue" @tab-remove="removeTab" type="border-card">
            <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" :closable="item.closable" v-html="item.content" :style="{ height: ifrHeight - 115 + 'px' }">
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      ifrHeight: document.documentElement.clientHeight - 60,
      editableTabsValue: '1',
      editableTabs: [
        {
          title: '首页',
          name: '1',
          content:
            '<iframe width="100%" height="100%" frameborder="0"></iframe>'
        }
      ],
      tabIndex: 1
    }
  },
  methods: {
    addTab (targetName, targetUrl) {
      let newTabName = ++this.tabIndex + ''
      this.editableTabs.push({
        title: targetName,
        name: newTabName,
        content:
          '<iframe src=' +
          targetUrl +
          ' width="100%" style="height:100%;" frameborder="0"></iframe>',
        closable: true
      })
      this.editableTabsValue = newTabName
    },
    removeTab (targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    }
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        that.ifrHeight = document.documentElement.clientHeight - 60
      })()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index-box {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #0d308c;
  height: 60px;
  line-height: 60px;
  color: #fff;
}

.el-menu {
  height: 100%;
}
</style>
