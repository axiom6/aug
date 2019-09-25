

<template>
  <div class="draw" ref="Draw">
    <d-dabs route="Draw" :pages="pages"></d-dabs>
    <h1 v-if="pageKey==='Draw'">Drawings in D3</h1>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">

  import Dabs from '../elem/Dabs.vue';
  import Drew from '../../pub/base/d3d/Drew.js'

  let Draw = {

    components:{ 'd-dabs':Dabs },

    data() {
      return { route:'Draw', pageKey:'Draw', drew:null, pages:{
        Wheel:   { title:'Wheel',   key:'Wheel',   obj:null },
        Axes:    { title:'Axes',    key:'Axes',    obj:null },
        Chord:   { title:'Chord',   key:'Chord',   obj:null },
        Link:    { title:'Link',    key:'Link',    obj:null },
        Radar:   { title:'Radar',   key:'Radar',   obj:null },
        Hue:     { title:'Hue',     key:'Hue',     obj:null },
        Tree:    { title:'Tree',    key:'Tree',    obj:null } } } },

    methods: {
      
      isPage: function(key) {
        return this.pageKey === key; },
      
      onTabs: function(obj) {
        if( this.route === obj.route ) {
            this.pageKey = obj.pageKey;
            this.create(this.pageKey); } },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Draw']['clientWidth' ];
        sz.compHeight = this.$refs['Draw']['clientHeight'];
        sz.elemWidth  = this.$refs['Draw']['clientWidth' ];
        sz.elemHeight = this.$refs['Draw']['clientHeight'];
        return sz; },
      
      create: function( key ) {
        if( this.pages[key].obj===null ) {
          this.$nextTick( function() {
            let elem = this.$refs[key][0]
            this.pages[key].obj = this.drew.create( key, elem, this.size() ); } ) } }
    },

    mounted: function () {
      this.subscribe(  'Nav', 'Draw.vue', (obj) => {
        this.onTabs(obj); } );
      this.$nextTick( function() {
        this.drew = new Drew( this.stream(), this.$refs['Draw'], this.size() ); } ) }
  }
  
  export default Draw;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .draw {   position:relative; left:0; top:0;  right:0; bottom:0; display:grid;
            background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; }
    .page { position:absolute; left:0; top:5%; right:0; bottom:0;  } }

  // Chords
  .group-tick line { stroke:#000;       }
  .ribbons         { fill-opacity:0.67; }
</style>