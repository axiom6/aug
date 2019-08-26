
<template>
  <div  class="icon" prac="prac" @click="doPrac(prac)">
    <i  :class="prac.icon"></i>
    <div class="name">{{prac.name}}</div>
  </div>
</template>

<script type="module">
  
  let Icon = {
    
    props: { comp:String, prac:Object },
    
    data() { return { } },
    
    methods: {
      
      isPage:  function () {
        return this.nav().page === 'Icon'; },
      doPrac: function (name) {
        publish( this.comp, name ); } },
        
    mounted: function () {} }

  export default Icon;
  
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .icon { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;
    background-color:@theme-back; color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-icon;
    .name { font-size:@theme-name-size; text-align:center; } }
</style>