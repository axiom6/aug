
<template>
  <div>
    <d-dabs route="Geom" :pages="pages"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">
  
  import Dabs  from '../elem/Dabs.vue';
  import Style from '../../pub/gan/lib/Style.js';

  export default {

    components:{ 'd-dabs':Dabs },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
            this.key = key;
            this.create(this.key); } },

      create: function( key ) {
        if( !this.pages[key].created ) {
             this.pages[key].created = true;
             this.$nextTick( function() { // Wait for DOM to render
               window['Geom'][key] = new Style( this.$refs[key][0] );
               this.pages[key].obj.ga(); } ) } }
    },

    mounted: function () {
      this.subscribe( 'Geom', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); } } );
      this.onTabs( this.key ); }
    }

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-back; display:grid; }

</style>