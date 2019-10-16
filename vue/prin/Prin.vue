
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
          this.doPage( this.nav().getPageKey('Prin') ); } }
      },

    beforeMount: function() {
      this.onComp('Prin'); },

    mounted: function () {
      this.doPage( this.nav().getPageKey('Prin') );
      this.subscribe( 'Nav', 'Prin.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Prin;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .prin-grid1x3() { display:grid; grid-template-columns:29fr 29fr 29fr; grid-template-rows:100fr;
    grid-template-areas: "em in en" }
  
  .prin-dir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;
                  justify-items:center; align-items:center; }

  @prinFS:2.0*@themeFS;

  .prin-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  
    .prin-comp { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-back; color:@theme-dark; font-size:@prinFS; border-radius:0.5*@prinFS;
      .prin-grid1x3(); justify-items:center; align-items:center; // The 4x4 Dim + Row + 9 Practices Grid
        .em { .prin-dir(em); } .in { .prin-dir(in); }  .en  { .prin-dir(en); } } }
  
</style>
