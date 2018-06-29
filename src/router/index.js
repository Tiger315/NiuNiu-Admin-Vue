import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import LawList from '@/components/law/LawList'
import LawListForWpf from '@/components/law/LawListForWpf'
import PVDays from '@/components/count/PVDays'
import PVDetail from '@/components/count/PVDetail'

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
  }]
})
