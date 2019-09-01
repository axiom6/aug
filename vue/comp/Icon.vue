
<template>
  <div  class="icon" @click="doPrac(pracObj.name)">
    <i  :class="pracObj.icon"></i>
    <div class="name">{{pracObj.name}}</div>
  </div>
</template>

<script type="module">
  
  let Icon = {
    
    props: { compKey:String, pracObj:Object },
    
    data() { return { } },
    
    methods: {
      doPrac: function (pracKey) {
        let obj = { level:"Prac", compKey:this.compKey, pracKey:pracKey };
        this.nav.pub( obj ); } }
  }
  export default Icon;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .icon { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-icon(); // @theme-icon-size;
    .name {             font-size:@theme-name-size; text-align:center; } }            // @theme-name-size;
</style>