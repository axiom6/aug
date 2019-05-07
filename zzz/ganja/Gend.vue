
<template>
  <div>
    <d-dabs comp="Geom" :pages="pages" :init="init"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">
  
  import Dabs  from '../elem/Dabs.vue';
  import Style from '../../src/ganja/lib/Style.js';
  
  export default {

    components:{ 'd-dabs':Dabs },

    props: { name:String, comp:String, pages:Object, init:String },

    data() {
      return { key:this.init } },

 // watch: { init: function( val, old ) { //  Need watch because mouned only gets called once
 //   console.log( 'Gend.watch()', { comp:this.comp, old:old, val:val } );
 //   this.onTabs( val ); } },
    
    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
            this.key = key;
            this.create(this.key); } },

      create: function( key ) {
        console.log( 'Gend.created()', { comp:this.comp, init:this.init, key:key } );
        if( !this.pages[key].created ) {  // key===this.key
          Style.init( key, this.$refs[key][0] );
          this.pages[key].created = true;
          this.pages[key].klass.ga(); } }
    },

    mounted: function () {
      console.log( 'Gend.mounted()', { comp:this.comp, init:this.init } );
      this.onTabs( this.init );
      this.subscribe( 'Geom', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); }
        else {
          /* console.log( 'GeomND.subscribe() on subject Geom', key ); */ } } ); },

    updated: function () {
      this.$nextTick( function () {
        console.log( 'Gend.updated()', { comp:this.comp, init:this.init } );
        this.onTabs( this.init );
      } ) }
    
    }

</script>

<style lang="less">
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black; display:grid; }

</style>