
<template>
  <div class="geom-nd-pane">
    <d-tabs :route="route" :pageKey="route" :pages="pages" defn="None"></d-tabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="page.show" class="geom-nd-page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs  from '../elem/Tabs.vue';
  import Style from '../../pub/geom/lib/Style.js';

  let GeomND = {

    components:{ 'd-tabs':Tabs },

    data() { return { route:'Geom', pages:{} } },

    methods: {
      
      onNav: function(obj) {
        if( this.mix().nav().isMyNav( obj, this.route ) ) {
          this.pageKey = this.mix().nav().getPageKey(this.route);
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
      this.mix().nav().setPages( this.route, this.pages );
      this.mix().subscribe(  'Nav', 'Geom.vue', (obj) => {
        this.onNav(obj); } ) }
    }
    
    export default GeomND;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @geomNDFS:@themeFS;
  
  .geom-nd-pane {}
  
  .geom-nd-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
     background-color:@theme-back; display:grid; font-size:@geomNDFS; }

</style>