
<template>
  <div class="prin-pane">
    <b-tabs :pages="pages"></b-tabs>
    <div class="prin" ref="Prin" title="Prin">
      <template v-for="pracObj in compObj">
        <div   :class="pracObj.dir" :key="pracObj.name" :ref="pracObj.name" :title="pracObj.name">
          <p-icon v-show="pages['Icon'].show" :pracObj="pracObj"></p-icon>
          <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
        </div>
      </template>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Icon from './Icon.vue';
  import Dirs from './Dirs.vue';
  
  let Prin = {

    components:{ 'b-tabs':Tabs, 'p-icon':Icon, 'p-dirs':Dirs },
    
    data() { return {
      compObj:null, pracObj:null,
      pages:{
        Icon: { name:'Icon', key:'Icon', show:false },
        Dirs: { name:'Dirs', key:'Dirs', show:false } } } },
    
    methods: {
      
      onComp: function (compKey) {
        this.compObj = this.compObject(compKey); },
      onPage: function(pageKey) {
        let  hasPage = this.showPages( this.pages, pageKey );
        if( !hasPage ) {
          this.doPage('Icon'); } },
      doPage: function(   pageKey ) {
        this.nav().set( { pageKey:pageKey } );
        this.pages[pageKey].show = true; },
      isRows: function () {
        return true; },
      onNav:  function (obj) {
        let pageKey = this.nav().pageKey;
        if( this.nav().level === 'Prin' ) {
          this.onComp(obj.compKey);
          this.onPage(    pageKey); } }
      },

    beforeMount: function() {
      this.onNav( { compKey:this.nav().compKey } ); },

    mounted: function () {
      this.subscribe( 'Nav', 'Prin.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Prin;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
               grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .grid1x3() { display:grid; grid-template-columns:29fr 29fr 29fr; grid-template-rows:100fr;
    grid-template-areas: "em in en" }
  
  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }
  
  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }

  .prin-pane {   position:relative; left:0; top:0;  right:0; bottom:0;
  
  .prin { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-prac-size;
          background-color:@theme-back; color:@theme-color-prac;
    
    .grid1x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid
      .em { .pdir(em);   } .in { .pdir(in); } .en { .pdir(en); }

    
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
    
  }
}
  
</style>
