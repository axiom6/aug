
<template>
  <div>
    <d-dabs comp="Geom" :pages="pages" :init="key"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">

  import Style   from '../../src/ganja/lib/Style.js';
  import Dabs    from '../elem/Dabs.vue';
  import Planes  from '../../src/ganja/4D/Planes.js';
  import Sphere  from '../../src/ganja/4D/Sphere.js';
//import Conform from '../../src/ganja/4D/Conform.js';

  export default {
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom4D', key:'Sphere', pages:{
          Planes:  { title:'Planes',  key:'Planes',  klass:Planes,  created:false },
          Sphere:  { title:'Sphere',  key:'Sphere',  klass:Sphere,  created:false }
       // Conform: { title:'Conform', key:'Conform', klass:Conform, created:false }
        } } },
    
    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
          this.key = key;
          this.create(this.key); } },

      create: function( key ) {
        // console.log( 'Geom4D.created()', { key:key, refs:this.$refs } );
        if( !this.pages[key].created ) {
          Style.init( key, this.$refs[key][0] );
          this.pages[key].created = true;
          this.pages[key].klass.ga(); } }
    },

    mounted: function () {
      // console.log( 'Geom4D.mounted()', { refs:this.$refs } );
      this.onTabs( this.key );
      this.subscribe( 'Geom', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); }
        else {
          /*console.log( 'Geom4D.subscribe() on subject Geom', key );*/ } } ); }

  }

</script>