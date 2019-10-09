
<template>
  <div class="disd">
    <d-tabs route="Disp" :pages="pages"></d-tabs>
    <d-dims v-if="pages['Dims'].show" :dispObj="dispObj"></d-dims>
    <d-desc v-if="pages['Desc'].show" :dispObj="dispObj"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dims from '../prac/Dims.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },
    
    data() { return { dispObj:null, // compKey:'Desc', 
      pages:{
        Dims: { title:'Disciplines',  key:'Dims', show:true  },
        Desc: { title:'Descriptions', key:'Desc', show:false } } } },
    
    methods: {
      
      onDisp: function(dispKey) {
        this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey );
        if( !this.isDef(this.dispObj) ) {
          console.error('Disp.onDisp() disp null',{comp:this.nav().compKey,prac:this.nav().pracKey,disp:dispKey})}},
      doPage: function( pageKey ) {
        this.nav().setPageKey( 'Disp', pageKey ); },
      onNav:  function (obj) {
        if( this.nav().isMyNav( obj, 'Disp' ) ) {
            this.onDisp( obj.dispKey ); } } },

    beforeMount: function() {
      this.onDisp( this.nav().dispKey ); },

    mounted: function () {
      this.doPage( this.nav().getPageKey('Disp','Desc') );
      this.subscribe(  "Nav", 'Disp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disd { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back; }
  
</style>

