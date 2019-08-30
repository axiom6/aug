
<template>
  <div class="disd" ref="Disp" title="Disp">
    <d-tabs :comp="comp" :pages="pages"></d-tabs>
    <d-desc v-show="pages['Desc'].show" :comp="comp" :prac="prac" :disp="disp"></d-desc>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Desc from './Desc.vue';
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-desc':Desc },
    
    data() { return {
      comp:'None', prac:'None', disp:'None', pobj:null, dobj:null,
      pages:{
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPage: function() {
        if( !this.isDef(this.pages[this.nav().page]) ) {
          this.nav().page = 'Desc'; }
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === this.nav().page; } },
      onNav:  function (obj) {
        if( obj===false ) {}
        this.onPage(); } },

    beforeMount: function() {
      this.comp = this.nav().comp;
      this.prac = this.nav().prac;
      this.disp = this.nav().disp;
      this.onPage(); },

    mounted: function () {
      this.subscribe(  "Nav", this.comp+'DispDisp.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .disd { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-icon-back; }
  
</style>

