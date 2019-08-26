
<template>
  <div id="Conn" class="conn" ref="Conn">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
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

  import Tabs    from '../elem/Tabs.vue';
  import Util    from '../../pub/base/util/Util.js';
  import Build   from '../../pub/ikw/cube/Build.js';
  import Connect from '../../pub/ikw/conn/Connect.js';

  export default {

    components:{ 'b-tabs':Tabs },

    data() {
      return { comp:'None', prac:'All', disp:'All',
               build:{}, connects:{}, practices:{}, size:{},
        pages:[
          { title:'Icon', view:'Page', page:'Icon' },
          { title:'Dirs', view:'Page', page:'Dirs' },
          { title:'Summ', view:'Page', page:'Summ' },
          { title:'Desc', view:'Page', page:'Desc' } ] }; },

    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      onPrac: function (prac) {
        if( prac==='All' && this.prac!=='All' ) {
          if( Util.isDef(this.connects[this.prac]) ) {
            this.connects[this.prac].layout( this.size, 'Restore'); }
          else {
            console.log( 'Conn.onPrac() connect undefined', { prat:this.prac } ); } }
        if( prac!=='All' && typeof(this.connects[prac])==='object' ) { // Expand prac to Comp size
          this.connects[prac].layout( this.size, 'Expand'); }
        this.prac = prac; this.disp='All';  },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onTabs: function ()    {}, // Does nothing
      onNone: function (obj) {
        console.error( 'Conn Nav Error', { obj:obj } ); },
      onNav:  function (obj) {
        switch( obj.level ) {
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          case 'Tabs' : this.onTabs();                  break;
          default     : this.onNone(obj); } },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      
      calcSize: function(prac) {        // Should only be called by $nextTick()
        let elem = this.$refs[prac][0]  // As in createConnects and resize()
        let sz   = {}
        if( typeof(this.$refs['Conn'])==='undefined' ) {
          console.log( 'Conn.calcSize() $refs[Conn] undefined', this.$refs ) }
        sz.compWidth  = this.$refs['Conn']['clientWidth' ];
        sz.compHeight = this.$refs['Conn']['clientHeight'];
        sz.elemWidth  = elem['clientWidth' ];
        sz.elemHeight = elem['clientHeight'];
        // console.log( 'Conn.calcSize()', prac, sz );
        return sz;
      },
      
      createConnects: function( stream, build ) {
        this.$nextTick( function() {
          for( let key of this.pkeys ) {
              let prac = this.practices[key];
              if( prac.row !== 'Dim' || this.comp === 'Prin') {
                let elem  = this.$refs[key][0]
                this.size = this.calcSize(key)
                this.connects[prac.name] = new Connect( stream, build, prac, elem, this.size ); } } } ) },
      
      resize: function() {
        this.$nextTick( function() {
          for( let key of this.pkeys ) {
            let level = key!==this.prac ? 'Resize' : 'Expand';
            if( level==='Expand') { this.connects[key].lastSize(this.size) }
            this.connects[key].layout( this.size, level ); } } ); }
    },

    beforeMount: function() {
      this.comp = this.nav().comp; },

    mounted: function () {
      this.build     = new Build(  this.batch() );
      this.practices = this.conns( this.comp );
      this.pkeys     = this.keys(  this.practices )
      this.subscribe(  this.comp,  this.comp+'.vue', (obj) => {
        if( obj.disp==='All' ) {   this.onPrac(obj.prac); }
        else                   {   this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Nav",      this.comp+'.vue', (obj) => {
        this.onNav(obj); } );
      this.createConnects( this.stream(), this.build ); },
    
    created: function () {
      window.addEventListener(   'resize', this.resize ) },
    destroyed: function () {
      window.removeEventListener('resize', this.resize ) }
   }

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid5x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 12fr 27fr 27fr 27fr;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid4x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 31fr 31fr 31fr;
    grid-template-areas: "tabs tabs tabs tabs" "le nw north ne" "do west cen east" "sh sw south se"; }

  .grid4x3() { display:grid; grid-template-columns:33.3fr 33.3fr 33.4fr; grid-template-rows:7fr 31fr 31fr 31fr;
    grid-template-areas: "tabs tabs tabs" "nw north ne" "west cen east" "sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; }
  
  .conn { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-conn-size;
          background-color:@theme-back; color:@theme-color;
    .grid4x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
    .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;
      justify-self:start; align-self:center; text-align:left; }
    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
    
    .prac { display:grid; border-radius:36px; width:99%; height:98%; font-size:@theme-prac-size; font-weight:bold;
      .name { justify-self:center; align-self:center; text-align:center; } }
  
    // Placed one level above .prac at the 9 Practices Grid Direction
    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;
      .prac { font-size:@theme-full-size; width:100%; height:100%;
        justify-self:center; align-self:center; display:grid; border-radius:0.5em;
        div {     padding-bottom:2rem;
          .disp { padding-bottom:0;
            i     { font-size:@theme-full-size; }
            .name { font-size:@theme-full-size; }
            .desc { font-size:@theme-full-size; display:block; } } }  // Turns on .disp .desc
        .area { padding-bottom:0; } } }
  }
</style>