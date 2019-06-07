


<template>
  <div class="geom" ref="Geom">
    <h1 v-if="comp==='Geom'">Geometric Algebra</h1>
    <template v-for="geom in geoms">
      <router-view :name="comp+geom.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  let Geom = {

    data() { return { comp:'Geom',
      geoms:[
        { title:'Geom2D', key:'2D' },
        { title:'Geom3D', key:'3D' },
        { title:'Geom4D', key:'4D' } ] } },

    mounted: function () {}

  }

  export default Geom;

</script>

<style lang="less">
  
  .geom {   position:relative; left:0; top:0; right:0; bottom:0; background-color:black; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } }
  
</style>;