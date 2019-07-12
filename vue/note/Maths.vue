
<template>
  <div class="maths" ref="MathsNB"></div>
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
  @import '../dash/theme.less';
  .maths { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:1.75vmin;
    display:grid; justify-items:center; align-items:center; text-align:center;
    background-color:@theme-back; color:@theme-color; overflow:scroll; }

</style>