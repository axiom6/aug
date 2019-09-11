
<template>
  <div class="disp" @click="doDisp(dispObj.name)">
    <i   :class="dispObj.icon"></i>
    <span class="name">{{dispObj.name}}</span>
  </div>
</template>

<script type="module">

  let Disp = {
    
    props: { dispObj:Object },

    methods: {
      doDisp: function (dispKey) {
        let obj = { level:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
        this.nav.pub( obj ); } } }
  
  export default Disp;
  
</script>

<style lang="less">

  @import '../../pub/css/themes/theme.less';

  .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size*3;
    i     { display:inline-block;  margin-right: 0.25rem; }
    .name { display:inline-block; } }

</style>