
<template>
  <div class="disd">
    <d-tabs route="Disp" :pages="pages"></d-tabs>
    <d-desc v-if="pages['Desc'].show" :dispObj="dispObj"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-desc':Desc },
    
    data() { return { compKey:'Desc', dispObj:null,
      pages:{
        Desc: { title:'Desc', key:'Desc', show:false } } } },
    
    methods: {
      
      onDisp: function(dispKey) {
        this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey );
        if( !this.isDef(this.dispObj) ) {
          console.error('Disp.onDisp() disp null',{comp:this.nav().compKey,prac:this.nav().pracKey,disp:dispKey})}},
      doPage: function( tabsKey ) {
        this.nav().setPageKey( 'Disp', tabsKey ); },
      onNav:  function (obj) {
        let tabsKey = this.nav().initTabsKey( 'Disp', 'Desc' );
        if( this.nav().isMyNav( obj, 'Disp' ) ) {
            this.onDisp( obj.dispKey );
            this.doPage( tabsKey ); } } },

    beforeMount: function() {
      this.onDisp( this.nav().dispKey ); },

    mounted: function () {
      this.subscribe(  "Nav", 'Disp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disd { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back; }
  
</style>

