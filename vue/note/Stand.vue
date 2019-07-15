
<template>
  <div class="stand" ref="StandNB"></div>
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
  @import '../../pub/css/themes/theme.less';
  .stand { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:1.75vmin;
    display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:@theme-back; color:@theme-color; overflow:scroll; }
  
</style>