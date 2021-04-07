
<template>
  <div class="math-pane" ref="Math">
    <h1 v-show="myRoute()">Mathematics</h1>
    <router-view :name="'MathML'"></router-view>
    <router-view :name="'MathEQ'"></router-view>
  </div>
</template>

<script type="module">

import { inject, onMounted } from 'vue';

  let Math = {

    setup() {

      const mix = inject('mix');

      const myRoute = function() {
        return mix.isRoute('Math'); }

    // onMounted( function () {
    //   console.log( 'Math.onMounted()' ); } )

    return { myRoute }; }
    
  }
  export default Math;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';

  @mathFS:@themeFS;
  
  .math-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; display:grid;
    h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@mathFS; } }

</style>