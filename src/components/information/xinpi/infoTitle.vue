<template>
  <div>
    <div class="page-title" v-if="passTime">
      <span></span>
      {{passTime}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'infoTitle',
  data () {
    return {
    }
  },
  props: ['passTime']
}
</script>
<style>
.page-title{
  position: relative;
    font-size: 16px;
    color: #000;
    display: inline-block;
    margin-top: 20px;
    font-weight: 700;
    padding-left: 1%;
    margin-bottom: 20px;
}
.page-title span{
    position: absolute;
    left: 0;
    top: 2px;
    width: 3px;
    height: 18px;
    background-color: #428bca;
}
</style>
