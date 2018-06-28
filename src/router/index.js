import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import LawList from '@/components/law/LawList'
import LawListForWpf from '@/components/law/LawListForWpf'

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
  }]
})
