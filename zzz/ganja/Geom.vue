


<template>
  <div class="geom" ref="Geom">
    <!--h1>Geometric Algebra</h1-->
    <template v-for="geom in geoms">
      <router-view :name="comp+geom.key" :comp="comp+geom.key" :pages="pages(geom.key)" :init="geom.init"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Style   from '../../src/ganja/lib/Style.js';
  import Basics  from '../../src/ganja/2D/Basics.js';
  import Lines   from '../../src/ganja/3D/Lines.js';
  import Grids   from '../../src/ganja/3D/Grids.js';
  import Play    from '../../src/ganja/3D/Play.js';
  import Isohed  from '../../src/ganja/3D/Isohed.js';
  import Planes  from '../../src/ganja/4D/Planes.js';
  import Sphere  from '../../src/ganja/4D/Sphere.js';

  let Geom = {

    data() { return { comp:'Geom', key:'2D',
      geoms:[
        { title:'Graph',      key:'2D', init:'Basics' },
        { title:'Projective', key:'3D', init:'Lines'  },
        { title:'Conformal',  key:'4D', init:'Sphere' } ],
      pages2D:{
        Basics:  { title:'Basics', key:'Basics',   klass:Basics,  created:false } },
      pages3D:{
        Lines:   { title:'Lines',  key:'Lines',    klass:Lines,   created:false },
        Grids:   { title:'Grids',  key:'Grids',    klass:Grids,   created:false },
        Play:    { title:'Play',   key:'Play',     klass:Play,    created:false },
        Isohed:  { title:'Isohed', key:'Isohed',   klass:Isohed,  created:false } },
      pages4D:{
        Planes:  { title:'Planes',  key:'Planes',  klass:Planes,  created:false },
        Sphere:  { title:'Sphere',  key:'Sphere',  klass:Sphere,  created:false }
     /* Conform: { title:'Conform', key:'Conform', klass:Conform, created:false } */ } } },
    
    methods: {
      pages: function( key ) {
        return this['pages'+key]; } },

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