
<template>
  <div class="embed-pane" ref="EmbedNB"></div>
</template>

<script type="module">

  import { Inspector, Runtime } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';
  import EmbedNB from './EmbedNB.js';

  export default {

    methods: {
      run: function( ref, notebook ){
        let elem = this.$refs[ref];
        Runtime.load( notebook, Inspector['into']( elem ) ); } },

    mounted: function () {
      this.run( 'EmbedNB', EmbedNB ) }

  }
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .embed-pane { position:absolute; left:0; top:@theme-tabs-height-pc; right:0; bottom:0; font-size:@theme-obs-size;
    display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:@theme-back; color:@theme-color; overflow:scroll; }

</style>