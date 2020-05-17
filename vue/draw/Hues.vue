

<template>
  <div class="hues-pane" ref="Hues">
    <d-tabs :route="route" :pages="pages"></d-tabs>
    <h1 v-if="pageKey==='Hues'">Hues with MathBox</h1>
    <template v-for="page in pages">
      <div :ref="page.key" v-if="page.show" class="hues-page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">

  import Tabs from '../elem/Tabs.vue';
  import Box  from '../../pub/math/mbox/Box.js'

  let Hues = {

    components:{ 'd-tabs':Tabs },

    data() {
      return { route:'Hues', pageKey:'Hues', pages:{
          Color:   { title:'Color',   key:'Color',   show:false },
          Rgbs:    { title:'Rgbs',    key:'Rgbs',    show:false },
          Polar:   { title:'Polar',   key:'Polar',   show:false },
          Vecs:    { title:'Vecs',    key:'Vecs',    show:false },
          Sphere:  { title:'Sphere',  key:'Sphere',  show:false },
          Regress: { title:'Regress', key:'Regress', show:false } } } },

    methods: {

      isPage: function(pageKey) {
        return this.pageKey === pageKey; },

      onNav: function(obj) {
        if( this.mix().nav().isMyNav( obj, this.route ) ) {
            this.pageKey = this.mix().nav().getPageKey(this.route);
            if( this.pageKey !== 'None') {
                this.doApp( this.pageKey ); } } },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Hues']['clientWidth' ];
        sz.compHeight = this.$refs['Hues']['clientHeight'];
        sz.elemWidth  = this.$refs['Hues']['clientWidth' ];
        sz.elemHeight = this.$refs['Hues']['clientHeight'];
        return sz; },

      doApp: function( pageKey ) {
          this.$nextTick( function() {
            let elem = this.$refs[pageKey][0];
            if( this.mix().isDef(elem) ) {
              Box.doApp(pageKey,elem); } } ) } },

    mounted: function () {
      this.mix().nav().setPages( this.route, this.pages );
      this.mix().subscribe(  'Nav', 'Hues.vue', (obj) => {
        this.onNav(obj); } ); }
  }

  export default Hues;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .hues-pane {   position:absolute; left:0; top:0; width:100%; height:100%; display:grid;
    background-color:@theme-back; font-family:@theme-font-family;
    h1    { @theme-h1; color:@theme-fore;  }
    .hues-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height  } }
  
</style>