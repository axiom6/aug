

<template>
  <div class="draw" ref="Draw">
    <d-dabs :comp="comp" :pages="pages" init="Axes"></d-dabs>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key">
        <!--h1>{{page.title}}</h1-->
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Dabs from '../elem/Dabs.vue';
  import Drew from '../../pub/drew/Drew.js'

  let Draw = {

    components:{ 'd-dabs':Dabs, drew:{} },

    data() {
      return { comp:'Draw', key:'Axes', pages:{
          Axes:    { title:'Axes',    key:'Axes',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Chord:   { title:'Chord',   key:'Chord',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Cluster: { title:'Cluster', key:'Cluster', obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Link:    { title:'Link',    key:'Link',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Radar:   { title:'Radar',   key:'Radar',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Radial:  { title:'Radial',  key:'Radial',  obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Tree:    { title:'Tree',    key:'Tree',    obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' },
          Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, icon:'fas fa-circle', src:'brew/AutoDrip.jpg' }
        } } },

    methods: {
      isPage: function(key) {
        return this.key === key; },
      onTabs: function(key) {
        this.key =  key;
        this.create(key); },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Draw']['clientWidth' ];
        sz.compHeight = this.$refs['Draw']['clientHeight'];
        sz.elemWidth  = this.$refs['Draw']['clientWidth' ];
        sz.elemHeight = this.$refs['Draw']['clientHeight'];
        return sz; },
      
      create: function( key ) {
        if( this.pages[key].obj===null ) {
            let elem = this.$refs[key][0]
            this.pages[key].obj = this.drew.create( key, elem, this.size() ); } }
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