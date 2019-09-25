

<template>
  <div class="hues" ref="Hues">
    <d-tabs route="Hues" :pages="pages"></d-tabs>
    <h1 v-if="pageKey==='Hues'">Hues with MathBox</h1>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
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
          Color:   { title:'Color',   key:'Color'   },
          Rgbs:    { title:'Rgbs',    key:'Rgbs'    },
          Polar:   { title:'Polar',   key:'Polar'   },
          Vecs:    { title:'Vecs',    key:'Vecs'    },
          Sphere:  { title:'Sphere',  key:'Sphere'  },
          Regress: { title:'Regress', key:'Regress' } } } },

    methods: {

      isPage: function(pageKey) {
        return this.pageKey === pageKey; },

      onTabs: function(obj) {
        if( this.isMyNav( obj, this.route, this.pages, obj.pageKey ) ) {
            this.pageKey = obj.pageKey;
            this.doApp(    obj.pageKey ); } },

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
            if( this.isDef(elem) ) {
              Box.doApp(pageKey,elem); } } ) }
    },

    mounted: function () {
      this.subscribe(  'Nav', 'Hues.vue', (obj) => {
        this.onTabs(obj); } ); }
  }

  export default Hues;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .hues {   position:relative; left:0; top:0;  right:0; bottom:0; display:grid;
    background-color:@theme-back; font-family:@theme-font-family;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; }
    .page { position:absolute; left:0; top:5%; right:0; bottom:0;  } }
  
</style>