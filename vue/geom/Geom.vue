


<template>
  <div class="geom" ref="Geom">
    <!--h1>Geometric Algebra</h1-->
    <template v-for="geom in geoms">
      <router-view :name="comp+geom.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Style   from '../../src/ganja/lib/Style.js';

  let Geom = {

    data() { return { comp:'Geom', key:'2D', geoms:[
        { title:'Graph',      key:'2D' },
        { title:'Projective', key:'3D' },
        { title:'Conformal',  key:'4D' } ] } },

    mounted: function () {
      // console.log( 'Geom.mounted()' );
      Style.size( this.$refs['Geom'] ); // mounted is best place to get page elem size
   // this.subscribe( this.comp, this.comp+'.vue', (obj) => {
   //     console.log( 'Geom.subscribe()', obj );
    }

  }

  export default Geom;

</script>

<style lang="less">
  
  .geom {   position:relative; left:0; top:0;  right:0; bottom:0; background-color:black;
    h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } }
  
</style>