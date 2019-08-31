
<template>
  <div   class="pane">
    <b-tabs :comp="cname" :pages="pages"></b-tabs>
    <div class="prac" :key="pname" :ref="pname" :title="pname">
      <p-dirs v-show="pages['Dirs'].show"></p-dirs>
      <p-conn   v-if="pages['Conn'].show"></p-conn>
      <p-desc v-show="pages['Desc'].show"></p-desc>
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
    
    // props: { prac:Object },
    
    data() { return {
      cname:'None', pname:'None', page:'None', prac:null,
      pages:{
        Dirs: { name:'Dirs', show:false },
        Conn: { name:'Conn', show:false },
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPrac: function(pname) {
        this.pname = pname;
        this.prac  = this.pracs(this.cname)[pname]; },
      onPage: function(page) {
        this.page = page;
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === page; } },
      },

    beforeMount: function() {
      this.cname = this.nav().comp;
      this.onPrac( this.nav().prac );  // onPage() here ?
      this.onPage( this.nav().page ); },

    mounted: function () {
      this.subscribe(  "Nav", 'Prac.vue', (obj) => {
        this.onPrac( obj.prac );
        this.onPage( obj.page ); } ); }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .pane {   position:relative; left:0; top:0;  right:0; bottom:0;
    
    .prac { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-icon-back; }
    
  }
  
</style>

