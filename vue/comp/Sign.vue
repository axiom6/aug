
<template>
  <div  class="comp-sign-pane" @click="doPrac(pracObj.name)">
    <i  :class="pracObj.icon"></i>
    <div class="comp-sign-name">{{pracObj.name}}</div>
  </div>
</template>

<script type="module">
  
  let Sign = {
    
    props: { pracObj:Object },
    
    data() { return { } },
    
    methods: {
      doPrac: function (pracKey) {
        let obj = { route:"Prac", pracKey:pracKey };
        this.nav().pub( obj ); } }
  }
  export default Sign;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .comp-sign-pane { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; text-align:center; .theme-sign();
    i               { font-size:1.8*@theme-sign-size; }
    .comp-sign-name { font-size:0.7*@theme-sign-size;  text-align:center; } }
  
</style>