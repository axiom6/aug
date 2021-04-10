
<template>
  <div class="geom-pane">
    <h1 v-show="myRoute()">Geometric Algebra</h1>
    <router-view name="Geom2D"></router-view>
    <router-view name="Geom3D"></router-view>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Geom = {

    setup() {

      const mix   = inject('mix');

      const myRoute =function() {
        return mix.isRoute('Geom'); }

    return { myRoute, }; }
  }

  export default Geom;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @geomFS:@themeFS;
  
  .geom-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;