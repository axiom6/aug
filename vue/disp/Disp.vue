
<template>
  <div class="disd">
    <d-tabs :pages="pages"></d-tabs>
    <d-desc v-show="pages['Desc'].show" :dispObj="dispObj"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-desc':Desc },
    
    data() { return { dispObj:null,
      pages:{
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      
      onDisp: function(dispKey) {
        this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey ); },
      onPage: function(pageKey) {
        for( let key in this.pages ) {
          this.pages[key].show = key === pageKey; } },
      onNav:  function (obj) {
        this.onDisp( obj.dispKey );
        this.onPage( obj.pageKey ); } },

    beforeMount: function() {
      this.onNav(this.nav()); },

    mounted: function () {
      this.subscribe(  "Nav", this.comp+'Disp.Disp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disd { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back; }
  
</style>

