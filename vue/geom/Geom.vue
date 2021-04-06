
<template>
  <div class="geom-pane">
    <h1 v-show="myRoute()">Geometric Algebra</h1>
    <!--template v-for="geom in geoms"-->
      <router-view :name="route"></router-view>
    <!--/template-->
  </div>
</template>

<script type="module">

  import { inject } from 'vue';

  let Geom = {

    data() { return { route:'GeomND',
      geoms:[
        { title:'Geom2D', key:'2D' },
        { title:'Geom3D', key:'3D' },
        { title:'Geom4D', key:'4D' } ] } },

    methods: {
      myRoute: function() {
        this.mix = inject('mix');
        return this.mix.isRoute('Geom'); } },

    mounted: function () {
      this.mix = inject('mix');
      this.nav = inject('nav');
      this.nav.route = this.route; }

  }

  export default Geom;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';

  @geomFS:@themeFS;
  
  .geom-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;