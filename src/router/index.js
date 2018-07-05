import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import LawList from '@/components/law/LawList'
import LawListForWpf from '@/components/law/LawListForWpf'
import PVDays from '@/components/count/PVDays'
import PVDetail from '@/components/count/PVDetail'
import CsrcIPO from '@/components/law/CsrcIPO'

Vue.use(Router)

export default new Router({  
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
    path: '/Law/CsrcIPO',
    name: 'CsrcIPO',
    component: CsrcIPO
  }]
})
