
<template>
  <div>
    <d-dabs comp="Data" :pages="pages"></d-dabs>
    <div class="page">
      <h1       v-if="isKey('None')">Pivots</h1>
      <p_pivot1 v-if="isKey('Pivot1')"></p_pivot1>
      <p_pivot2 v-if="isKey('Pivot2')"></p_pivot2>
    </div>
  </div>
</template>

<script type="module">

  import Dabs   from '../elem/Dabs.vue';
  import Pivot1 from './Pivot1.vue';
  import Pivot2 from './Pivot2.vue';

  let Pivots = {

    components:{ 'd-dabs':Dabs, 'p_pivot1':Pivot1, 'p_pivot2':Pivot2 },

    data() {
      return { comp:'Pivots', key:'None',
        pages:{
          Table1: { title:'Pivot1', key:'Pivot1' },
          Table2: { title:'Pivot2', key:'Pivot2' } } } },

    methods: {

      isKey: function(key) {
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

  export default Pivots;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }

</style>