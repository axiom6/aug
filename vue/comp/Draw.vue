

<template>
  <div class="draw" ref="Draw">
    <d-tabs :comp="comp" :pages="pages" init="Axes"></d-tabs>
    <template v-for="page in pages">
      <div :ref="page.short" v-show="isPage(page.short)" class="page" :key="page.short">
        <!--h1>{{page.title}}</h1-->
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Dabs from '../comp/Dabs.vue';
  import Drew from '../../pub/drew/Drew.js'

  let Draw = {

    components:{ 'd-tabs':Dabs, drew:{} },

    data() {
      return { comp:'Draw', tab:'Axes', pages:{
          Axes:    { title:'Axes',    short:'Axes',    obj:null },
          Chord:   { title:'Chord',   short:'Chord',   obj:null },
          Cluster: { title:'Cluster', short:'Cluster', obj:null },
          Link:    { title:'Link',    short:'Link',    obj:null },
          Radar:   { title:'Radar',   short:'Radar',   obj:null },
          Radial:  { title:'Radial',  short:'Radial',  obj:null },
          Tree:    { title:'Tree',    short:'Tree',    obj:null },
          Wheel:   { title:'Wheel',   short:'Wheel',   obj:null }
        } } },

    methods: {
      isPage: function(short) {
        return this.tab === short; },
      onTabs: function(tab) {
        this.tab =  tab;
        this.create(tab); },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Draw']['clientWidth' ];
        sz.compHeight = this.$refs['Draw']['clientHeight'];
        sz.elemWidth  = this.$refs['Draw']['clientWidth' ];
        sz.elemHeight = this.$refs['Draw']['clientHeight'];
        return sz; },
      
      create: function( tab ) {
        console.log( 'Draw.create(tab)', tab )
        console.log( 'Draw.create(tab)', this.$refs[tab][0] )
        if( this.pages[tab].obj===null ) {
            let elem = this.$refs[tab][0]
            this.pages[tab].obj = this.drew.create( tab, elem, this.size() ); } }
    },

    mounted: function () {
      this.drew = new Drew( this.stream(), this.$refs['Draw'], this.size() );
      this.onTabs('Axes');
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
        this.onTabs(obj); } );
    }

  }
  
  export default Draw;
  
</script>

<style lang="less">
  
  .draw {   position:relative; left:0; top:0;  right:0; bottom:0;
    .page { position:absolute; left:0; top:5%; right:0; bottom:0; display:grid; background-color:black;
      h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } } }

  // Chords
  .group-tick line { stroke:#000;       }
  .ribbons         { fill-opacity:0.67; }
</style>