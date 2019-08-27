
<template>
  <div  class="icon" @click="doPrac(prac)">
    <i  :class="prac.icon"></i>
    <div class="name">{{prac.name}}</div>
  </div>
</template>

<script type="module">
  
  let Icon = {
    
    props: { comp:String, prac:Object },
    
    data() { return { } },
    
    methods: {
      doPrac: function (prac) {
        this.nav().pub( { prac:prac.name } ); }, },
        
    mounted: function () {} }

  export default Icon;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .icon { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-icon();
    .name { font-size:@theme-name-size; text-align:center; } }
</style>