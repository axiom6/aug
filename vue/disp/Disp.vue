
<template>
  <div class="disd" ref="Disp" title="Disp">
    <d-tabs :comp="comp" :pages="pages"></d-tabs>
    <d-desc v-show="pages['Desc'].show"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-desc':Desc },
    
    data() { return {
      cname:'None', pname:'None', dname:'None', page:'None', disp:null,
      pages:{
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPrac: function(pname) {
        this.pname = pname; },
      onDisp: function(dname) {
        this.dname = dname;
        this.disp  = this.pracs(this.cname)[this.pname][this.dname]; },
      onPage: function(page) {
        this.page = page==='Desc' ? 'Desc' : 'Desc'; // Change when more pages added
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === this.page; } },
      onNav:  function (obj) {
        this.cname = obj.comp;
        this.onPrac( obj.prac );
        this.onDisp( obj.disp );
        this.onPage( obj.page ); } },

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

