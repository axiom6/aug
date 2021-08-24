
<template>
  <div class="prac-disp-pane" @click="doDisc(dispObj.name)">
    <i   :class="dispObj.icon"></i>
    <span class="prac-disp-name">{{dispObj.name}}</span>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Disc = {
    
    props: { dispObj:Object },

    setup() {

      const nav = inject( 'nav' );

      const doDisc = function (dispKey) {
        // console.log( 'Disc.doDisp()', { dispKey:dispKey, dispObj:props.dispObj } );
        let obj = { source:'Disc.doDisp()', level:"Disp", dispKey:dispKey };
        nav.pub( obj ); }

    return { doDisc }; }
  }
  
  export default Disc;
  
</script>

<style lang="less">

  @import '../../../lib/css/themes/theme.less';
  
  @pracDispFS:@themeFS;

  .prac-disp-pane {   display:inline; justify-self:center; align-self:center; text-align:center;
     i     {          display:inline-block;  margin-right: 0.25*@pracDispFS; }
    .prac-disp-name { display:inline-block; } }

</style>