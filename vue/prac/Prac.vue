
<template>
  <div   class="pane">
    <b-tabs route="Prac" :pages="pages"></b-tabs>
    <div class="prac">
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
    
    data() { return { pracObj:null,
      pages:{
        Dirs: { title:'Dirs', key:'Dirs', show:false },
        Conn: { title:'Conn', key:'Conn', show:false },
        Desc: { title:'Desc', key:'Desc', show:false } } } },
    
    methods: {
      
      onPrac: function(pracKey) {
        if( !this.isDef(this.pracObj) || this.pracObj.name !== pracKey ) {
             this.pracObj = this.pracObject( this.nav().compKey, pracKey ); } },
      doPage: function(   pageKey ) {
        this.pages[pageKey].show = true; },
      onNav: function( obj ) {
        if( this.isMyNav( obj, 'Prac', this.pages, obj.pageKey ) ) {
          this.onPrac( obj.pracKey );
          this.doPage( obj.pageKey ); } }
      },

    beforeMount: function () {
      this.onNav( { pracKey:this.nav().pracKey } ); },

    mounted: function () {
      this.subscribe(  "Nav", 'Prac.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .pane {   position:relative; left:0; top:0;  right:0; bottom:0;
    
    .prac { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-icon-back; }
    
  }
  
</style>

