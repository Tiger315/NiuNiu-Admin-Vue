<template>
  <div class="law-list-wpf-box" v-cloak>
    <div>123456789</div>
  </div>
</template>

<script>
export default {
  name: 'LawListWpf',
  data () {
    return {
      curLaw: {
        zTitle: '法律法规详细内容',
        zID: '',
        zPublishDate: '1986-03-15',
        zValidFlag: 1,
        zWj: [],
        zScope: '',
        zSourcePlace: '',
        zSign: '',
        zGrade: 5,
        zContent: '',
        zAttchementTotal: 0,
        zAttachementData: [],
        zNavData: []
      }
    }
  },
  methods: {
    getLawAttachement (zID) {
      const that = this
      that.getData('LawAttachement' + '/' + zID, true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          that.curLaw.zAttchementTotal = 0
          that.curLaw.zAttachementData = []
          if (result.Total > 0) {
            that.curLaw.zAttchementTotal = result.Total
            that.curLaw.zAttachementData = result.Data
          }
        }
      })
    },
    getLawDetail (zID) {
      const that = this
      that.getData('Law/Det' + '/' + zID, true, function (res) {
        if (res.Code === 1000) {
          var result = res.Result
          if (result.Total > 0) {
            that.curLaw.zContent = result.Data[0].content
            that.curLaw.zNavData = JSON.parse(result.Data[0].navigation)
          }
        }
      })
    }
  },
  created () {
    console.log(this.getParameter('row'))
    var curLawStr = this.getParameter('row')
    alert('aa' + this.$route.query.row)
    if (curLawStr) {
      var curLawData = JSON.parse(decodeURI(curLawStr))
      this.curLaw.zID = curLawData.id
      this.curLaw.zTitle = curLawData.title
      this.curLaw.zPublishDate = curLawData.publish_date
      this.curLaw.zSign = curLawData.sign
      this.curLaw.zScope = curLawData.law_scope_name
      this.curLaw.zSourcePlace = curLawData.source_place
      this.curLaw.zValidFlag = curLawData.valid_flag
      this.curLaw.zWj = curLawData.law_wj_name.replace('|', '/')
      this.getLawAttachement(this.curLaw.zID)
      this.getLawDetail(this.curLaw.zID)
    }
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
[v-cloak] {
  display: none;
}
</style>
