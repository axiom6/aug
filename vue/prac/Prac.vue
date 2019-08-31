
<template>
  <div   class="pane">
    <b-tabs :comp="comp" :pages="pages"></b-tabs>
    <div class="prac" :key="prac" :ref="prac" :title="prac">
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
    
    data() { return {
      comp:'None',
      pages:{
        Dirs: { name:'Dirs', show:false },
        Conn: { name:'Conn', show:false },
        Desc: { name:'Desc', show:false } } } },
    
    methods: {
      onPage: function() {
        if( !this.isDef(this.pages[this.nav().page]) ) {
          this.nav().page = 'Dirs'; }
        for( let pkey in this.pages ) {
          this.pages[pkey].show = pkey === this.nav().page; } },
      },

    beforeMount: function() {
      this.comp =  this.nav().comp;
      this.onPage(); },

    mounted: function () {
      this.subscribe(  "Nav", 'Prac.vue', (obj) => {
        if( obj === false ) {} // obj ignored
        this.onPage(); } ); }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .pane {  position:relative; left:0;  top:0;  right:0; bottom:0;
    
    .prac { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-icon-back; }
    
  }
  
</style>

