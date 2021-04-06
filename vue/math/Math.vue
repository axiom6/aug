
<template>
  <div class="math-pane" ref="Math">
    <h1 v-show="myRoute()">Mathematics</h1>
    <template v-for="math in maths">
      <router-view :name="route+math.key"></router-view>
    </template>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Math = {

    setup() {

      const mix = inject('mix');
      const route = 'Math';
      const maths = [
        { title:'MathML', key:'ML' },
        { title:'MathEQ', key:'EQ' } ];

      const myRoute = function() {
        return mix.isRoute('Math'); }

    return { myRoute, maths }; }
  }
  export default Math;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';

  @mathFS:@themeFS;
  
  .math-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; display:grid;
    h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@mathFS; } }

</style>