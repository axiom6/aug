
<template>
  <div class="comp-pane">
    <b-tabs  route="Comp"    :pages="tabPages('Comp')" position="left" ></b-tabs>
    <b-tabs :route="compKey" :pages="tabPages(compKey)"     position="right" v-if="hasInov()"></b-tabs>
    <div class="comp-comp" ref="Comp">
      <template v-for="pracObj in compObj">
        <div   :class="pracObj.dir">
          <p-sign   v-if="Comp['Sign'].show" :pracObj="pracObj"></p-sign>
          <p-dirs   v-if="Comp['Dirs'].show" :pracObj="pracObj"></p-dirs>
          <p-desc   v-if="Comp['Desc'].show" :pracObj="pracObj"></p-desc>
          <template v-if="Comp['Conn'].show">
            <p-conn v-if="!isDim(pracObj)" :pracObj="pracObj" level="Comp"></p-conn>
            <p-sign v-if=" isDim(pracObj)" :pracObj="pracObj"></p-sign>
          </template>
        </div>
      </template>
      <template v-for="row in myRows">
        <div v-show="isRows()" :class="row.dir">
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
  import Desc from './Desc.vue';
  
  let Comp = {

    components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },
    
    data() { return { compKey:'None', inovKey:'None', compObj:null, pracObj:{}, myRows:{},
      Comp:{
        Sign: { title:'Practices',    key:'Sign', show:true  },
        Dirs: { title:'Disciplines',  key:'Dirs', show:false },
        Conn: { title:'Connections',  key:'Conn', show:false },
        Desc: { title:'Descriptions', key:'Desc', show:false } },
      Info:{
        Info: { title:'Information',  key:"Info", show:true,  icon:"fas fa-th"         },
        Soft: { title:'Software',     key:"Soft", show:false, icon:"fas fa-codepen"    },
        Data: { title:'Data',         key:"Data", show:false, icon:"fas fa-table"      } },
      Know:{
        Know: { title:'Knowledge',    key:"Know", show:true,  icon:"fas fa-university" },
        Scie: { title:'Science',      key:"Scie", show:false, icon:"fas fa-flask"          },
        Math: { title:'Math',         key:"Math", show:false, icon:"fas fa-calculator"     } },
      Wise:{
        Wise: { title:'Wisdom',       key:"Wise", show:true, icon:"fas fa-tripadvisor" } },
      Rows: {
        Plane:{ name:'Information', dir:'cm', icon:"fas fa-th" },
        Learn:{ name:'Learn',       dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',          dir:'do', icon:"fas fa-cog" },
        Share:{ name:'Share',       dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      tabPages: function(route) {
        return this[route]; },
      hasInov: function() {
        return this.mix().hasInov(this.compKey); },
      onRows: function () {
         let pages            = this.tabPages('Comp');
         let pageKey          = 'Sign'
         this.myRows          = this.Rows;
         this.myRows['Plane']      = pages[pageKey];
         this.myRows['Plane'].name = pages[pageKey].title
         this.myRows['Plane'].dir  = 'cm';  },
      onComp: function( obj ) {
        this.compKey = obj.compKey;
        this.inovKey = obj.inovKey;
        // console.log( 'comp.onComp()', { compKey:this.compKey, inovKey:this.inovKey, obj:obj } )
        this.onRows();
        this.compObj = this.mix().inovObject( this.compKey, this.inovKey ); },
      isDim: function ( pracObj ) {
        return pracObj.row==="Dim"; },
      isRows: function () {
        return true; },
      onNav:  function( obj ) {
        if( obj.route === 'Comp' || this.hasInov() ) {
            this.onComp( obj ); } } },

    beforeMount: function() {
      this.onComp( { route:'Comp', compKey:this.nav().compKey, inovKey:this.nav().inovKey } ); },

    mounted: function () {
      this.mix().subscribe( 'Nav', 'Comp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Comp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .comp-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .comp-grid4x4() { display:grid; grid-template-columns:16fr 28fr 28fr 28fr; grid-template-rows:25fr 25fr 25fr 25fr;
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
