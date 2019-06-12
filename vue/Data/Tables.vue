
<template>
  <div>
    <d-dabs comp="Data" :pages="pages" :init="key"></d-dabs>
      <div class="page" :key="page.key">
        <t_table1 :v-if="isPage('Table1')"></t_table1>
        <t_table2 :v-if="isPage('Table2')"></t_table2>
      </div>
  </div>
</template>

<script type="module">
  
  import Dabs   from '../elem/Dabs.vue';
  import Table1 from './Table1.vue';
  import Table2 from './Table2.vue';
  
  let Tables = {
    
    components:{ 'd-dabs':Dabs, 't_table1':Table1, 't_table2':Table2 },

    data() {
      return { comp:'Tables', key:'Table1',
        pages:[
          { title:'Table1', key:'Table1' },
          { title:'Table2', key:'Table2' } ] } },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        if( this.pages[key] ) {
            this.key = key;
         /* this.create(this.key); */ } },

      create: function( key ) {
        if( !this.pages[key].created ) {
          this.pages[key].created = true;
          this.$nextTick( function() { // Wait for DOM to render
            let elem = this.$refs[key][0];
            if( elem===false) {} } ) } }
    },

    mounted: function () {
      this.subscribe( 'Data', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key ); } } );
      this.onTabs( this.key ); }

  }
  
  export default Tables;

</script>

<style lang="less">
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black; display:grid; }

</style>