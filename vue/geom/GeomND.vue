
<template>
  <div>
    <d-tabs :route="route" :pages="pages"></d-tabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="page.show" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs  from '../elem/Tabs.vue';
  import Style from '../../pub/gan/lib/Style.js';

  let GeomND = {

    components:{ 'd-tabs':Tabs },

    data() { return { route:'None', pages:{} } },

    methods: {
      
      onNav: function(obj) {
        if( this.nav().isMyNav( obj, this.route ) ) {
          this.pageKey = this.nav().getPageKey(this.route);
          if( this.pageKey !== 'None') {
              this.create(this.pageKey); } } },

      create: function( pageKey ) {
        if( !this.pages[pageKey].created ) {
             this.pages[pageKey].created = true;
             this.$nextTick( function() { // Wait for DOM to render
               window['Geom'][pageKey] = new Style( this.$refs[pageKey][0] );
               this.pages[pageKey].obj.ga(); } ) } }
    },

    mounted: function () {
      this.subscribe(  'Nav', 'Geom.vue', (obj) => {
        this.onNav(obj); } ) }
    }
    
    export default GeomND;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-back; display:grid; }

</style>