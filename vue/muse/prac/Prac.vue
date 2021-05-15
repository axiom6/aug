
<template>
  <div   class="prac-pane">
    <b-tabs :route="'Prac'" :pages="pages"></b-tabs>
    <div class="prac-prac" :key="pracIdx">
      <p-dirs v-show="nav.isShow('Prac','Dirs')" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="nav.isShow('Prac','Conn')" :pracObj="pracObj" level="Prac"></p-conn>
      <p-desc v-show="nav.isShow('Prac','Desc')" :pracObj="pracObj"></p-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../../base/elem/Tabs.vue';
  import Dirs from './Dirs.vue';
  import Conn from '../comp/Conn.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onMounted, onBeforeMount } from 'vue';
  
  let Prac = {

    components:{ 'b-tabs':Tabs, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

    setup() {

      const mix     = inject( 'mix' );
      const nav     = inject( 'nav' );
      const debug   = false;
      const pracObj = ref(null);
      const pracIdx = ref(0   );
      
      const pages = {
        Dirs: { title:'Area',  key:'Dirs', show:true  },
        Conn: { title:'Graph', key:'Conn', show:false },
        Desc: { title:'Text',  key:'Desc', show:false } };

      const onPrac = function( obj ) {
        pracObj.value = mix.pracObject( obj.compKey, obj.inovKey, obj.pracKey );
        pracIdx.value++;
        if( debug ) {
          console.log( 'Prac.onPrac()', { pracIdx:pracIdx.value, pracObj:pracObj.value, pracKey:obj.pracKey } ); } }

      const onNav = function( obj ) {
        //console.log( 'Prac.onNav()', obj.route )
        onPrac( obj ); }
      
      onBeforeMount( function () {
        nav.setPages( 'Prac', pages );
        let obj = {}
        obj.compKey = nav.compKey;
        obj.pracKey = nav.pracKey;
        obj.inovKey = nav.inovKey;
        onPrac( obj );  } )

      onMounted( function () {
        // console.log( 'Prac.onMounted()')
        mix.subscribe(  "Nav", 'Prac.vue', (obj) => {
          onNav(obj); } ); } )
      
    return { pracObj, pracIdx, pages, nav }; }
  }
  
  export default Prac;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @pracFS:2.0*@themeFS;
  
  .prac-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    
    .prac-prac { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;
      background-color:@theme-back; font-size:@pracFS; border-radius:0.5*@pracFS; } }
  
</style>

<!--
    //const onNav = function( obj ) {
    //  if( nav.isMyNav( obj, 'Prac' ) ) {
    //    onPrac( obj ); } }

if( !mix.isDef(pracObj.value) || pracObj.value.name !== obj.pracKey ) {
-->

