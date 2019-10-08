
<template>
  <div class="comp-pane">
    <b-tabs route="Comp" :pages="pages"></b-tabs>
    <div class="comp" ref="Comp" title="Comp">
      <template v-for="pracObj in compObj">
        <div   :class="pracObj.dir" :key="pracObj.name" :ref="pracObj.name" :title="pracObj.name">
          <p-icon v-show="pages['Icon'].show" :pracObj="pracObj"></p-icon>
          <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
          <p-conn   v-if="pages['Conn'].show" :pracObj="pracObj" level="Comp"></p-conn>
        </div>
      </template>
      <template v-for="row in myRows">
        <div v-show="isRows()" :class="row.dir" :key="row.name">
          <p-icon :pracObj="row"></p-icon>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Icon from './Icon.vue';
  import Dirs from './Dirs.vue';
  import Conn from './Conn.vue';
  
  let Comp = {

    components:{ 'b-tabs':Tabs, 'p-icon':Icon, 'p-dirs':Dirs, 'p-conn':Conn },
    
    data() { return {
      compObj:null, pracObj:null, myRows:null,
      pages:{
        Icon: { title:'Practices',    key:'Icon', show:true  },
        Dirs: { title:'Disciplines',  key:'Dirs', show:false },
        Conn: { title:'Connections',  key:'Conn', show:false },
        Data: { title:'Data Science', key:'Data', show:false } },
      rows: {
        Plane:{ name:'Information', dir:'cm', icon:"fas fas fa-th" },
        Learn:{ name:'Learn',       dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',          dir:'do', icon:"fas fas fa-cog" },
        Share:{ name:'Share',       dir:'sh', icon:"fas fa-share-alt-square" } },
      planes: {
        Info:{ name:'Information',  dir:'cm', icon:"fas fas fa-th" },
        Know:{ name:'Knowledge',    dir:'cm', icon:"fas fas fa-university"  },
        Wise:{ name:'Wisdom',       dir:'cm', icon:"fas fas fa-tripadvisor" },
        Data:{ name:'Data Science', dir:'cm', icon:"fas fas fa-table" } } } },
    
    methods: {
      onRows: function (compKey) {
         this.myRows          = this.rows;
         this.myRows['Plane'] = this.planes[compKey]; },
      onComp: function (compKey) {
        this.compObj = this.compObject(compKey);
        this.onRows(compKey); },
      doPage: function( pageKey ) {
        this.nav().setPageKey( 'Comp', pageKey ); },
      isRows: function () {
        return true; },
      onNav:  function (obj) {
        if( this.nav().isMyNav( obj, 'Comp' ) ) {
          let compKey = obj.pageKey==='Data' ? 'Data'      : obj.compKey;
          let pageKey = obj.pageKey==='Data' ? obj.prevKey : this.nav().getPageKey('Comp','Icon');
          // console.log( 'Comp.onNav()', { prevKey:obj.prevKey, compKey:compKey, pageKey:pageKey, obj:obj } );
          this.onComp( compKey );
          this.doPage( pageKey ); } }
      },

    beforeMount: function() {
      this.onComp( this.nav().compKey ); },

    mounted: function () {
      this.doPage( this.nav().getPageKey('Comp','Icon') );
      this.subscribe( 'Nav', 'Comp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Comp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid4x4() { display:grid; grid-template-columns:13fr 29fr 29fr 29fr; grid-template-rows:25fr 25fr 25fr 25fr;
    grid-template-areas:"cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }

  .comp-pane { position:relative; left:0; top:0; right:0; bottom:0;
  
    .comp { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-prac-size;
            background-color:@theme-back; color:@theme-color-prac;
      .grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
        .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
        .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
        .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
        .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
      
      .cm .icon { background-color:@theme-back; }
      
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
  }
</style>
