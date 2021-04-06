
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
  
  @import '../../css/themes/theme.less';
  
  @embedFS:@themeFS;
  
  .embed-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    font-size:@embedFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }

</style>