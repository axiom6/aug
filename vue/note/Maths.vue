
<template>
  <div class="maths-pane" ref="MathsNB"></div>
</template>

<script type="module">

  import { Inspector, Runtime } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';
  import MathsNB from './CheatNB.js';

  export default {

    methods: {
      run: function( ref, notebook ){
        let elem = this.$refs[ref];
        Runtime.load( notebook, Inspector['into']( elem ) ); } },

    mounted: function () {
      this.run( 'MathsNB', MathsNB ) }

  }
</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  
  @mathsFS:@themeFS;

  .maths-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    font-size:@mathsFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }

</style>