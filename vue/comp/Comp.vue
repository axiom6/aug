
<template>
  <div class="comp" ref="Comp" title="Comp">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <template v-for="prac in practices">
      <div :class="prac.dir" :key="prac.name" :ref="prac.name" :title="prac.name">
        <p-icon v-show="pages['Icon'].show" :comp="comp" :prac="prac"></p-icon>
        <p-dirs v-show="pages['Dirs'].show" :comp="comp" :prac="prac"></p-dirs>
        <p-conn   v-if="pages['Conn'].show" :comp="comp" :prac="prac"></p-conn>
        <p-desc v-show="pages['Desc'].show" :comp="comp" :prac="prac"></p-desc>
      </div>
    </template>
    <template v-for="row in rows">
      <div v-show="isRows()" :class="row.dir" :key="row.name">
        <p-icon :comp="comp" :prac="row"></p-icon>
      </div>
    </template>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Icon from './Icon.vue';
  import Dirs from './Dirs.vue';
  import Conn from './Conn.vue';
  import Desc from './Desc.vue';
  
  let Comp = {

    components:{ 'b-tabs':Tabs, 'p-icon':Icon, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },
    
    props: { pcomp:{ type:String, default:'None' } },
    
    data() { return {
      comp:'None', prac:'All', disp:'All', practices:{},
      pages:{
        Icon: { name:'Icon', show:false },
        Dirs: { name:'Dirs', show:false },
        Conn: { name:'Conn', show:false },
        Desc: { name:'Desc', show:false } },
      rows: {
        Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cog" },
        Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      onPage: function (page) {
      //console.log( 'Comp.onPage()', { page:page } );
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === page; } },
      isRows: function () {
        return this.prac==='All' },
      onComp: function (comp) {
        this.comp = comp; this.prac = 'All'; this.disp='All';
        this.practices = this.pracs(this.comp); },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onNone: function (obj) {
        console.error( 'Page Nav Error', { obj:obj } ); },
      onNav:  function (obj) {
        this.onPage(this.nav().page);
        switch( obj.level ) {
          case 'Comp' : this.onComp(obj.comp);          break;
          case 'Prac' : this.onPrac(obj.prac);          break;
          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
          default     : this.onNone(obj); } },
      },

    beforeMount: function() {
      this.comp = this.nav().comp;
      this.onPage(this.nav().page); },

    mounted: function () {
      this.practices = this.pracs(this.comp);
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Nav",     this.comp+'.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Comp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid5x4() { display:grid; grid-template-columns:13fr 29fr 29fr 29fr; grid-template-rows:8fr 24fr 24fr 24fr 24fr;
    grid-template-areas: "tabs tabs tabs tabs" "cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }
  
  .comp { position:relative; left:0; top:0; right:0; bottom:0; font-size:@theme-prac-size;
          background-color:@theme-back; color:@theme-color-prac;
    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
      .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;
             justify-self:start; align-self:center; text-align:left; }
      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
    
      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;
    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:@theme-prac-size;
      font-weight:bold;
      .grid3x3(); // The 4 Displine plus Practiice name Grid
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:@theme-cen-size; }
      div   { font-size:@theme-dir-size; } }
    
    .em, .in, .en { .prac .cen { font-size:@theme-row-size; } } // Font size columns
  
    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:@theme-row-size;
      font-weight:bold; display:grid;
      div { text-align:center; justify-self:center;  align-self:center; font-size:@theme-row-size; color:@theme-color; }
      i { margin-bottom: 0.2rem; display:block; } }
    
  }
  
</style>
