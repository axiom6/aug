
<template>
  <div class="comp-pane">
    <b-tabs route="Comp" :pages="pages" position="left" ></b-tabs>
    <b-tabs route="Inov" :pages="inovs" position="right" v-if="hasInnov()"></b-tabs>
    <div class="comp-comp" ref="Comp" title="Comp">
      <template v-for="pracObj in compObj">
        <div   :class="pracObj.dir" :key="pracObj.name" :ref="pracObj.name" :title="pracObj.name">
          <p-sign v-show="pages['Sign'].show" :pracObj="pracObj"></p-sign>
          <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
          <p-conn   v-if="pages['Conn'].show" :pracObj="pracObj" level="Comp"></p-conn>
        </div>
      </template>
      <template v-for="row in myRows">
        <div v-show="isRows()" :class="row.dir" :key="row.name">
          <p-sign :pracObj="row"></p-sign>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Sign from './Sign.vue';
  import Dirs from './Dirs.vue';
  import Conn from './Conn.vue';
  
  let Comp = {

    components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs, 'p-conn':Conn },
    
    data() { return { compObj:null, pracObj:{}, myRows:{},
      pages:{
        Sign: { title:'Practices',    key:'Sign', show:true  },
        Dirs: { title:'Disciplines',  key:'Dirs', show:false },
        Conn: { title:'Connections',  key:'Conn', show:false } },
      inovs:{
        Info: { title:'Tech', key:'Info', show:true  },
        Data: { title:'Data', key:'Data', show:false } },
      rows: {
        Plane:{ name:'Information', dir:'cm', icon:"fas fas fa-th" },
        Learn:{ name:'Learn',       dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',          dir:'do', icon:"fas fas fa-cog" },
        Share:{ name:'Share',       dir:'sh', icon:"fas fa-share-alt-square" } },
      planes: {
        Info:{ name:'Techs',      dir:'cm', icon:"fas fas fa-cogs" },
        Know:{ name:'Knowledge', dir:'cm', icon:"fas fas fa-university"  },
        Wise:{ name:'Wisdom',    dir:'cm', icon:"fas fas fa-tripadvisor" },
        Data:{ name:'Data',      dir:'cm', icon:"fas fas fa-table" } } } },
    
    methods: {
      hasInnov: function() {
        return this.isDef(this.compObj) && this.isDef(this.compObj['Team']); },
      onRows: function (compKey) {
         this.myRows          = this.rows;
         this.myRows['Plane'] = this.planes[compKey]; },
      onComp: function (compKey) {
        this.compObj = this.compObject(compKey);
        // console.log( 'Comp.onComp()', compKey, this.compObj );
        this.onRows( compKey); },
      doPage: function( objKey ) {
        let pageKey = objKey==='None' ? this.nav().getPageKey('Comp','Sign') : objKey;
        this.nav().setPageKey( 'Comp', pageKey ); },
      isRows: function () {
        return true; },
      onNav:  function (obj) {
        if( this.nav().isMyNav( obj, 'Comp' ) ) { // || this.isPageKeyComp(obj.pageKey) )
          let compKey = this.isPageKeyComp(obj.pageKey) ? obj.pageKey : obj.compKey;
          let pageKey = this.isPageKeyComp(obj.pageKey) ? obj.prevKey : obj.pageKey;
          this.onComp( compKey );
          this.doPage( pageKey ); } }
      },

    beforeMount: function() {
      this.onComp( this.nav().compKey ); }, //       this.doPage( this.nav().getPageKey('Comp','Sign') );

    mounted: function () {
      this.subscribe( 'Nav', 'Comp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Comp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .comp-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .comp-grid4x4() { display:grid; grid-template-columns:13fr 29fr 29fr 29fr; grid-template-rows:25fr 25fr 25fr 25fr;
    grid-template-areas:"cm em in en" "le nw north ne" "do west cen east" "sh sw south se"; }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  @compFS:2.0*@themeFS;

  .comp-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  
    .comp-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
            background-color:@theme-back; color:@theme-dark; font-size:@compFS; border-radius:0.5*@compFS;
      .comp-grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
        .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }
        .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }
        .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }
        .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }
      
      .cm .comp-sign { background-color:@theme-back; }
    }
  }

</style>
