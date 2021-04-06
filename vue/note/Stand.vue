
<template>
  <div class="stand-pane" ref="StandNB"></div>
</template>

<script type="module">

  import { Inspector, Runtime } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';
  import StandNB from './StandNB.js';
  
  export default {

    methods: {
      run: function( ref, notebook ){
        let elem = this.$refs[ref];
        Runtime.load( notebook, Inspector['into']( elem ) ); } },

    mounted: function () {
      this.run( 'StandNB', StandNB ) }
      
  }
</script>

<style lang="less">
  @import '../../css/themes/theme.less';
  
  @standFS:@themeFS;

  .ganja-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    font-size:@standFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }
  
</style>