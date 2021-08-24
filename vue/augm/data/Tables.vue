
<template>
  <div>
    <d-tabs :compKey="compKey" :pages="pages"></d-tabs>
    <div class="page">
      <h1       v-if="pageKey==='Tables'">Tables</h1>
      <t_table1 v-if="pages['Table1'].show" ref="Table1"></t_table1>
      <t_table2 v-if="pages['Table2'].show" ref="Table2"></t_table2>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  import Tabs   from '../../../lib/vue/elem/Tabs.vue';
  import Table1 from './Table1.vue';
  import Table2 from './Table2.vue';
  
  let Tables = {
    
    components:{ 'd-tabs':Tabs, 't_table1':Table1, 't_table2':Table2 },

    data() {
      return { compKey:'Tables', pageKey:'Tables',
        pages:{
          Table1: { title:'Table1', key:'Table1', created:false, show:false },
          Table2: { title:'Table2', key:'Table2', created:false, show:false } } } },

    methods: {

      isPageKey: function(pageKey) {
        return this.pageKey === pageKey; },

      onNav: function(obj) {
        if( this.nav.isMyNav(obj,'Prac',[this.compKey]) ) {
          this.pageKey = this.nav.getPageKey('Tables');
          if( this.pageKey !== 'none' ) {
              this.create( this.pageKey ); } } },

      create: function( pageKey ) {
        if( !this.pages[pageKey].created ) {
             this.pages[pageKey].created = true;
             this.$nextTick( function() { // Wait for DOM to render
              let elem = this.$refs[pageKey][0];
              if( elem===false) {} } ) } }
    },

    mounted: function () {
      this.nav = inject('nav');
    //this.nav.setPages( this.compKey, this.pages );
      this.nav.subscribe( 'Nav', 'Pivots', (obj) => {
        this.onNav( obj ); } ); }
  }
  
  export default Tables;

</script>

<style lang="less">
  
  @import '../../../lib/css/themes/theme.less';
  
  .page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
          background-color:@theme-back; display:grid;
    h1    { @theme-h1;  color:@theme-fore; } }

</style>