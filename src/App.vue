<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.shareLawList.el-popover{
  min-width: 0px;
}
textarea{
  resize:none
}
.el-tooltip__popper.is-dark{
  width: 50%;
}
ul,li{
  list-style: none;
}
.fr{
  float: right;
}
.fl{
  float: left;
}
.clearfix {
    zoom: 1;
}
.clearfix:before, .clearfix:after {
    content: " ";
    display: table;
}
.clearfix:after {
    clear: both;
    visibility: hidden;
    font-size: 0;
    height: 0;
}
.el-main,.el-footer,.el-header{
 padding:0px !important;
}
</style>
