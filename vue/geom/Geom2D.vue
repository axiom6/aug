
<template>
  <div>
    <d-dabs comp="Geom" :pages="pages" :init="key"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">
  
  import Dabs    from '../elem/Dabs.vue';
  import Style   from '../../src/ganja/lib/Style.js';
  import Basics  from '../../src/ganja/2D/Basics.js';

  export default {

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom3D', key:'Basics', pages:{
        Basics:  { title:'Basics', key:'Basics', klass:Basics, created:false }
    } } },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
          this.key = key;
          this.create(this.key); } },

      create: function( key ) {
        // console.log( 'Geom3D.created()', { key:key, refs:this.$refs } );
        if( !this.pages[key].created ) {
          Style.init( key, this.$refs[key][0] );
          this.pages[key].created = true;
          this.pages[key].klass.ga(); } }
    },

    mounted: function () {
      // console.log( 'Geom2D.mounted()', { refs:this.$refs } );
      this.onTabs( this.key );
      this.subscribe( 'Geom', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); }
        else {
          /*console.log( 'Geom2D.subscribe() on subject Geom', key );*/ } } ); }

  }

</script>

<style lang="less">
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black; display:grid; }

</style>