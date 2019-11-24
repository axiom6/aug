
<template>
  <div class="geom-pane">
    <h1 v-show="myRoute()">Geometric Algebra</h1>
    <template v-for="geom in geoms">
      <router-view :name="comp+geom.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  let Geom = {

    data() { return {
      geoms:[
        { title:'Geom2D', key:'2D' },
        { title:'Geom3D', key:'3D' },
        { title:'Geom4D', key:'4D' } ] } },

    methods: {
      myRoute: function() {
        return this.isRoute('Geom'); } },

    mounted: function () {}

  }

  export default Geom;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @geomFS:@themeFS;
  
  .geom-pane { position:absolute; left:0; top:0; width:100%; height:100%;
               background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@geomFS; } }
  
</style>;