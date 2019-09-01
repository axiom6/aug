
<template>
  <div   class="pane">
    <b-tabs :pages="pages"></b-tabs>
    <div class="prac" :key="pracKey" :ref="pracKey" :title="pracKey">
      <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="pages['Conn'].show" :pracObj="pracObj"></p-conn>
      <p-desc v-show="pages['Desc'].show" :pracObj="pracObj"></p-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Dirs from './Dirs.vue';
  import Conn from '../comp/Conn.vue';
  import Desc from './Desc.vue';
  
  let Prac = {

    components:{ 'b-tabs':Tabs, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },
    
    data() { return {
      compKey:'None', pracKey:null, pracObj:null,
      pages:{
        Dirs: { name:'Dirs', show:false },
        Conn: { name:'Conn', show:false },
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPrac: function(pracKey) {
        this.pracKey = pracKey;
        this.pracObj = this.pracObject( this.compKey,pracKey ); },
      onPage: function(page) {
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === page; } },
      },

    beforeMount: function() {
      this.compKey = this.nav().compKey;
      this.onPrac(   this.nav().pracKey );  // onPage() here ?
      this.onPage(   this.nav().pageKey ); },

    mounted: function () {
      this.subscribe(  "Nav", 'Prac.vue', (obj) => {
        this.onPrac( obj.pracKey );
        this.onPage( obj.pageKey ); } ); }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .pane {   position:relative; left:0; top:0;  right:0; bottom:0;
    
    .prac { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-icon-back; }
    
  }
  
</style>

