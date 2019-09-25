

<template>
  <div class="hues" ref="Hues">
    <d-dabs route="Hues" :pages="pages"></d-dabs>
    <h1 v-if="key==='Hues'">Hues with MathBox</h1>
    <template v-for="page in pages">
      <div :ref="page.key" v-show="isPage(page.key)" class="page" :key="page.key"></div>
    </template>
  </div>
</template>

<script type="module">

  import Dabs from '../elem/Dabs.vue';
  import Box  from '../../pub/math/mbox/Box.js'

  let Hues = {

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Hues', key:'Hues', pages:{
          Color:   { title:'Color',   key:'Color'   },
          Rgbs:    { title:'Rgbs',    key:'Rgbs'    },
          Polar:   { title:'Polar',   key:'Polar'   },
          Vecs:    { title:'Vecs',    key:'Vecs'    },
          Sphere:  { title:'Sphere',  key:'Sphere'  },
          Regress: { title:'Regress', key:'Regress' } } } },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key) {
        this.key =  key;
        this.doApp( key ); },

      size: function() {
        let sz   = {}
        sz.compWidth  = this.$refs['Hues']['clientWidth' ];
        sz.compHeight = this.$refs['Hues']['clientHeight'];
        sz.elemWidth  = this.$refs['Hues']['clientWidth' ];
        sz.elemHeight = this.$refs['Hues']['clientHeight'];
        return sz; },

      doApp: function( key ) {
          this.$nextTick( function() {
            let elem = this.$refs[key][0];
            // console.log( 'Hues.doApp()', { key:key, elem:elem } );
            if( this.isDef(elem) ) {
              Box.doApp(key,elem); } } ) }
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