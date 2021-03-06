import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import LawList from '@/components/law/LawList'
import LawListForWpf from '@/components/law/LawListForWpf'
import PVDays from '@/components/count/PVDays'
import PVDetail from '@/components/count/PVDetail'
import CsrcIPO from '@/components/information/IPO/CsrcIPO'
import MailTemplate from '@/components/mail/MailTemplateList' // 邮件模版列表
import MailStatus from '@/components/mail/MailStatus' // 邮件状态
import InfoDisclosure from '@/components/information/xinpi/InfoDisclosure' // 信批智库
import HuiboReport from '@/components/information/huibo/HuiboPresentation' // 慧博研究报告
import SupervisionType from '@/components/information/yuqing/SupervisionType' // 舆情监管动态
import IrregularitiesType from '@/components/information/yuqing/IrregularitiesType' // 舆情违规案例
import Feedback from '@/components/information/yuqing/Feedback' // 舆情监管函件
import Message from '@/components/Message/MsgStatus' // 短信发送状态
import MsgTemplateList from '@/components/Message/MsgTemplateList' // 新增短信模版
import managerInfo from '@/components/information/managerInfo/managers'// 公司管理人员信息

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'Index',
    component: Index
  }, {
    path: '/Law/LawList',
    name: 'LawList',
    component: LawList
  }, {
    path: '/Law/LawListForWpf',
    name: 'LawListForWpf',
    component: LawListForWpf
  }, {
    path: '/count/PVDays',
    name: 'PVDays',
    component: PVDays
  }, {
    path: '/count/PVDetail',
    name: 'PVDetail',
    component: PVDetail
  }, {
    path: '/Info/CsrcIPO',
    name: 'CsrcIPO',
    component: CsrcIPO
  }, {
    path: '/Mail/MailTemplateList',
    name: 'MailTemplate',
    component: MailTemplate
  }, {
    path: '/Mail/MailStatus',
    name: 'MailStatus',
    component: MailStatus
  }, {
    path: '/Info/InfoDisclosure',
    name: 'InfoDisclosure',
    component: InfoDisclosure
  }, {
    path: '/Info/HuiboPresentation',
    name: ' HuiboReport',
    component: HuiboReport
  }, {
    path: '/yuqing/supervisionType',
    name: ' SupervisionType',
    component: SupervisionType
  }, {
    path: '/yuqing/IrregularitiesType',
    name: ' IrregularitiesType',
    component: IrregularitiesType
  }, {
    path: '/yuqing/feedback',
    name: ' Feedback',
    component: Feedback
  }, {
    path: '/Message/MsgStatus',
    name: ' Message',
    component: Message
  }, {
    path: '/Message/MsgTemplateList',
    name: ' MsgTemplateList',
    component: MsgTemplateList
  }, {
    path: '/Info/managers',
    name: ' managerInfo',
    component: managerInfo
  }]
})
