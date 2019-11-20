
<template>
  <div class="prac-disp-pane" @click="doDisp(dispObj.name)">
    <i   :class="dispObj.icon"></i>
    <span class="prac-disp-name">{{dispObj.name}}</span>
  </div>
</template>

<script type="module">

  let Disp = {
    
    props: { dispObj:Object },

    methods: {
      doDisp: function (dispKey) {
        let obj = { route:"Disp", dispKey:dispKey };
        this.nav().pub( obj ); } } }
  
  export default Disp;
  
</script>

<style lang="less">

  @import '../../pub/css/themes/theme.less';
  
  @pracDispFS:@themeFS;

  .prac-disp-pane {   display:inline; justify-self:center; align-self:center; text-align:center;
     i     {          display:inline-block;  margin-right: 0.25*@pracDispFS; }
    .prac-disp-name { display:inline-block; } }

</style>