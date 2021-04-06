
<template>
  <div>
    <d-tabs :route="route" :pages="pages" defn="None"></d-tabs>
    <div class="page">
      <h1       v-if="isPageKey('None')">Pivots</h1>
      <p_pivot1 v-if="pages['Pivot1'].show"></p_pivot1>
      <p_pivot2 v-if="pages['Pivot2'].show"></p_pivot2>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  import Tabs   from '../elem/Tabs.vue';
  import Pivot1 from './Pivot1.vue';
  import Pivot2 from './Pivot2.vue';

  let Pivots = {

    components:{ 'd-tabs':Tabs, 'p_pivot1':Pivot1, 'p_pivot2':Pivot2 },

    data() {
      return { route:'Pivots', pageKey:'None',
        pages:{
          Table1: { title:'Pivot1', key:'Pivot1', created:false, show:false },
          Table2: { title:'Pivot2', key:'Pivot2', created:false, show:false } } } },

    methods: {

      isPageKey: function(pageKey) {
        return this.pageKey === pageKey; },

      onNav: function(obj) {
        if( this.nav.isMyNav( obj, this.route ) ) {
          this.pageKey = this.nav.getPageKey('Pivots');
          if( this.pageKey !== 'None' ) {
              this.create( this.pageKey ); } } },

      create: function( pageKey ) {
        if( !this.pages[pageKey].created ) {
          this.pages[pageKey].created = true;
          this.$nextTick( function() { // Wait for DOM to render
            let elem = this.$refs[pageKey][0];
            if( elem===false) {} } ) } }
    },

    mounted: function () {
      this.mix = inject('mix');
      this.nav = inject('nav');
      this.nav.setPages( this.route, this.pages );
      this.mix.subscribe( 'Nav', 'Pivots.vue', (obj) => {
          this.onNav( obj ); } ); }

  }

  export default Pivots;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  .page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
    background-color:@theme-back; display:grid;
    h1    {  @theme-h1; color:@theme-fore; } }

</style>