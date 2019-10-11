
<template>
  <div class="prin-pane">
    <b-tabs route="Prin" :pages="pages"></b-tabs>
    <div class="prin-comp">
        <template v-for="pracObj in compObj">
          <div   :class="pracObj.dir" :key="pracObj.name" :ref="pracObj.name" :title="pracObj.name">
            <p-sign v-show="pages['Sign'].show" :pracObj="pracObj"></p-sign>
            <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
          </div>
        </template>
      </div>
    </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Sign from './Sign.vue';
  import Dirs from './Dirs.vue';
  
  let Prin = {

    components:{ 'b-tabs':Tabs, 'p-sign':Sign, 'p-dirs':Dirs },
    
    data() { return {
      compObj:null, pracObj:null,
      pages:{
        Sign: { title:'Foundation', key:'Sign', show:true  },
        Dirs: { title:'Principles', key:'Dirs', show:false } } } },
    
    methods: {
      
      onComp: function( compKey ) {
        this.compObj = this.compObject(compKey); },
      doPage: function( pageKey ) {
        this.nav().setPageKey( 'Prin', pageKey ); },
      isRows: function () {
        return true; },
      onNav:  function (obj) {
        if( this.nav().isMyNav(  obj, 'Prin' ) ) {
          this.onComp( obj.compKey );
          this.doPage( this.nav().getPageKey('Prin','Sign') ); } }
      },

    beforeMount: function() {
      this.onComp('Prin'); },

    mounted: function () {
      this.doPage( this.nav().getPageKey('Prin','Sign') );
      this.subscribe( 'Nav', 'Prin.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Prin;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .prin-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .prin-grid1x3() { display:grid; grid-template-columns:29fr 29fr 29fr; grid-template-rows:100fr;
    grid-template-areas: "em in en" }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }

  .prin-pane {   position:relative; left:0; top:0;  right:0; bottom:0;
  
  .prin-comp { position:absolute; left:0; top:@theme-tabs-height-pc; right:0; bottom:0; .theme-prin();
    
    .prin-grid1x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
      .em { .pdir(em);   } .in { .pdir(in); } .en { .pdir(en); } } }
    
      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;
    /*
    .prin-prac { background-color:#603; .theme-prac(); font-weight:bold; .prin-grid3x3(); 
                             .north { .ddir(north); }
      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }
                             .south { .ddir(south); }
      .cen  { font-size:1.5*@theme-prin-size; }
      div   { font-size:1.4*@theme-prin-size; } }
    
    .em, .in, .en { .prin-prac .cen { font-size:1.6*@theme-prin-size; } } // Font size columns
   */


  
</style>
