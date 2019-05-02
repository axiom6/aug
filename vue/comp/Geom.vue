

<template>
  <div class="geom" ref="Geom">
    <d-dabs :comp="comp" :pages="pages" :init="key"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key">
        <!--h1>{{page.title}}</h1-->
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Dabs   from '../elem/Dabs.vue';
  import Basics from '../../src/ganja/Basics.js';
  import Planes from '../../src/ganja/Planes.js';
  import Sphere from '../../src/ganja/Sphere.js';
  import Lines  from '../../src/ganja/Lines.js';
  import Grids  from '../../src/ganja/Grids.js';
  import Play   from '../../src/ganja/Play.js';
  import Isohed from '../../src/ganja/Isohed.js';
  import Style  from '../../src/ganja/Style.js' ;


  let Geom = {

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom', key:'Grids', pages:{
          Basics:  { title:'Basics', key:'Basics', klass:Basics, created:false },
          Planes:  { title:'Planes', key:'Planes', klass:Planes, created:false },
          Sphere:  { title:'Sphere', key:'Sphere', klass:Sphere, created:false },
          Lines:   { title:'Lines',  key:'Lines',  klass:Lines,  created:false },
          Grids:   { title:'Grids',  key:'Grids',  klass:Grids,  created:false },
          Play:    { title:'Play',   key:'Play',   klass:Play,   created:false },
          Isohed:  { title:'Isohed', key:'Isohed', klass:Isohed, created:false }
        } } },

    methods: {
      
      isPage: function(key) {
        return this.key === key; },
      
      onTabs: function(key) {
        this.key =  key;
        this.create(key); },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Geom']['clientWidth' ];
        sz.compHeight = this.$refs['Geom']['clientHeight'];
        sz.elemWidth  = this.$refs['Geom']['clientWidth' ];
        sz.elemHeight = this.$refs['Geom']['clientHeight'];
        return sz; },

      create: function( key ) {
        if( !this.pages[key].created ) {
          Style.init( key, this.$refs[key][0] );
          this.pages[key].created = true;
          this.pages[key].klass.ga(); } }
    },

    mounted: function () {
      Style.size( this.$refs[this.key][0] ); // mounted is best place to get page elem size
      this.onTabs(this.key);
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
        this.onTabs(obj); } ); }

  }

  export default Geom;

</script>

<style lang="less">
  
  .geom {   position:relative; left:0; top:0;  right:0; bottom:0;
    .page { position:absolute; left:0; top:5%; right:0; bottom:0; display:grid; background-color:black;
      h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } } }
  

</style>