
<template>
  <div   class="prac-pane">
    <b-tabs route="Prac" :pages="pages"></b-tabs>
    <div class="prac-prac">
      <p-dirs v-show="pages['Dirs'].show" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="pages['Conn'].show" :pracObj="pracObj" level="Prac"></p-conn>
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
        Dirs: { title:'Disciplines',  key:'Dirs', show:true  },
        Conn: { title:'Connections',  key:'Conn', show:false },
        Desc: { title:'Descriptions', key:'Desc', show:false } } } },
    
    methods: {
      
      onPrac: function( obj ) {
        if( !this.mix().isDef(this.pracObj) || this.pracObj.name !== obj.pracKey ) {
             this.pracObj = this.mix().pracObject( obj.compKey, obj.inovKey, obj.pracKey ); } },
      doPage: function( pageKey ) {
        this.mix().nav().setPageKey( 'Prac', pageKey ); },
      onNav: function( obj ) {
        if( this.mix().nav().isMyNav( obj, 'Prac' ) ) {
            this.doPage( this.mix().nav().getPageKey('Prac') );
            this.onPrac( obj ); } }
      },

    beforeMount: function () {
      let obj = {}
      obj.compKey = this.mix().nav().compKey;
      obj.pracKey = this.mix().nav().pracKey;
      obj.inovKey = this.mix().nav().inovKey;
      this.onPrac( obj );  },

    mounted: function () {
      this.doPage( this.mix().nav().getPageKey('Prac') );
      this.mix().subscribe(  "Nav", 'Prac.vue', (obj) => {
        this.onNav(obj); } ); }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @pracFS:2.0*@themeFS;
  
  .prac-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    
    .prac-prac { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-gray; font-size:@pracFS; border-radius:0.5*@pracFS; } }
  
</style>

