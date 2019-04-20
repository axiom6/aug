
<template>
  <div id="Conn" class="conn" ref="Conn">
    <template v-for="prac in practices">
      <div v-show="isPrac(prac.name)" ref="Prac" :class="pracDir(prac.dir)" :key="prac.name">
        <div :id="prac.name" :ref="prac.name" class="prac"
          @click="pubPrac(prac.name)" style="background-color:rgba(97,56,77,1.0)">
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  
  import Build   from '../../pub/cube/Build.js'
  import Connect from '../../pub/conn/Connect.js'

  export default {

    // props: { comp:{ type:String, default:'None' } },

    data() {
      return { prac:'All', disp:'All', tab:'Connections',
               build:{}, connects:{}, practices:{} }; },

    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      onPrac: function (prac) {
        if( this.isConnect(this.prac) ) {  // Restore any previous expanded prac layout
            this.connects[ this.prac].layout('Elem'); }
        if( this.isConnect(prac) ) {
            this.connects[prac].layout('Comp'); } // Expand prac to Comp size
        this.prac = prac; this.disp='All';  },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onTabs: function (tab) {
        if( tab==='Connections' && this.tab==='Connections' && this.prac!=='All' ) {
          this.connects[this.prac].layout('Elem');
          this.onPrac('All'); }
        this.tab = tab; },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      isConnect: function ( prac ) {
        return prac !== 'All' && typeof(this.practices[prac])==='object'
          && this.practices[prac].row !== 'Dim'; },
      
      createConnects: function( stream, build ) {
        let compWidth  = this.$refs['Conn']['clientWidth' ];
        let compHeight = this.$refs['Conn']['clientHeight'];
        for( let key in this.practices ) {
          if( this.practices.hasOwnProperty(key) ) {
            let prac = this.practices[key];
            if( prac.row !== 'Dim' ) {
              let elem = this.$refs[prac.name][0]
              let size = { compWidth:compWidth, compHeight:compHeight,
                elemWidth:elem['clientWidth' ], elemHeight:elem['clientHeight'] };
              this.connects[prac.name] = new Connect( stream, build, prac, size, elem ); } } }
        return this.connects; },
      
      resize: function() {
        //console.log( 'Conn.resize() Connects', this.connects );
        for( let prac in this.practices ) {
          if( this.practices.hasOwnProperty(prac) && this.isConnect(prac) ) {
            console.log( 'Conn.resize() prac', prac );
            this.connects[prac].layout('Elem'); } }
        if( this.isConnect(this.prac) ) {
            this.connects[ this.prac].layout('Comp'); } }
    },

    beforeMount: function() {
      this.comp = this.$route.name.substring(0,4); },
      //console.log( 'Conn.beforeMount()', this.$route.name, this.comp );

    mounted: function () {
      this.build     = new Build( this.batch() );
      this.practices = this.conns( this.comp );
      this.subscribe(  this.comp,  this.comp+'.vue', (obj) => {
        if( obj.disp==='All' ) { this.onPrac(obj.prac); }
        else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Tabs",    this.comp+'.vue', (obj) => {
        this.onTabs(obj); } );
      this.$nextTick( function() {
        this.connects  = this.createConnects( this.stream(), this.build ); } ) },
    
    created: function () {
      window.addEventListener(   'resize', this.resize ) },
    destroyed: function () {
      window.removeEventListener('resize', this.resize ) }
   }

</script>

<style lang="less">
  .grid5x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 12% 27% 27% 27%;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 31% 31% 31%;
    grid-template-areas: "tabs tabs tabs tabs" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid4x3() { display:grid; grid-template-columns:33.3% 33.3% 33.4%; grid-template-rows:7% 31% 31% 31%;
    grid-template-areas: "tabs tabs tabs" "nw north ne" "west cen east" "sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; }
  
  .conn { background-color:black; position:absolute; left:0; top:5%; right:0; bottom:0; font-size:1.75vmin;
    .grid4x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
    .tabs{ grid-area:tabs; display:inline; color:wheat; font-size:1.2em;
      justify-self:start; align-self:center; text-align:left; }
    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
    
    .prac { display:grid; border-radius:36px; width:99%; height:98%; font-size:1em; font-weight:bold;
      .name { justify-self:center; align-self:center; text-align:center; } }
  
    // Placed one level above .prac at the 9 Practices Grid Direction
    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:1em; width:100%; height:100%;
        justify-self:center; align-self:center; display:grid; border-radius:0.5em;
        div {     padding-bottom:2em;
          .disp { padding-bottom:0;
            i     { font-size:1.6em; }
            .name { font-size:1.6em; }
            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc
        .area { padding-bottom:0; } } }
  }
</style>