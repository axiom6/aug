

<template>
  <div class="draw-pane">
    <d-tabs route="Draw" :pages="pages" defn="None"></d-tabs>
    <h1 v-if="pageKey==='Draw'">Drawings in D3</h1>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="page.show" class="draw-page" :key="page.key"></div>
    </template>
    </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import D3D  from '../../pub/draw/show/D3D.js'

  let Draw = {

    components:{ 'd-tabs':Tabs },

    data() {
      return { route:'Draw', pageKey:'Draw', D3D:null, pages:{
        Wheel: { title:'Wheel', key:'Wheel', obj:null, show:false },
        Axes:  { title:'Axes',  key:'Axes',  obj:null, show:false },
        Chord: { title:'Chord', key:'Chord', obj:null, show:false },
        Link:  { title:'Link',  key:'Link',  obj:null, show:false },
        Radar: { title:'Radar', key:'Radar', obj:null, show:false },
        Hue:   { title:'Hue',   key:'Hue',   obj:null, show:false },
        Tree:  { title:'Tree',  key:'Tree',  obj:null, show:false } } } },

    methods: {
      
      onNav: function(obj) {
        if( this.nav().isMyNav( obj, this.route ) ) {
            this.pageKey = this.nav().getPageKey('Draw','None'); // None implies no defaults
            if( this.pageKey !== 'None') {
                this.create(this.pageKey); } } },
      
      create: function( pageKey ) {
            this.$nextTick( function() {
              let elem = this.$refs[pageKey][0]
              this.pages[pageKey].obj = this.D3D.create( pageKey, elem ); } ) }
    },

    mounted: function () {
      this.subscribe(  'Nav', 'Draw.vue', (obj) => {
        this.onNav(obj); } );
      this.$nextTick( function() {
        this.D3D = new D3D( this.stream() ); } ) }
  }
  
  export default Draw;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @drawFS:@themeFS;
  
  .draw-pane { position:absolute; left:0; top:0; width:100%; height:100%;display:grid;
               background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@drawFS; }
    .draw-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;  } }

  // Chords
  .group-tick line { stroke:#000;       }
  .ribbons         { fill-opacity:0.67; }
</style>