
<template>
  <div   class="prac-pane">
    <b-tabs :compKey="'Prac'" :pages="pages"></b-tabs>
    <div class="prac-prac" :key="pracIdx">
      <p-dirs v-show="nav.isShow('Prac','Topics')" :pracObj="pracObj"></p-dirs>
      <p-conn   v-if="nav.isShow('Prac','Graphs')" :pracObj="pracObj" level="Prac"></p-conn>
      <p-desc v-show="nav.isShow('Prac','Texts')"  :pracObj="pracObj"></p-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../../base/elem/Tabs.vue';
  import Dirs from './Dirs.vue';
  import Conn from '../comp/Conn.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onBeforeMount, onMounted } from 'vue';
  
  let Prac = {

    components:{ 'b-tabs':Tabs, 'p-dirs':Dirs, 'p-conn':Conn, 'p-desc':Desc },

    setup() {

      const mix     = inject('mix');
      const nav     = inject('nav');
      const debug   = false;
      const pracObj = ref(null);
      const pracIdx = ref(0   );
      
      const pages = nav.pages['Prac']

      const onPrac = (obj) => {
        pracObj.value = mix.pracObject( obj.compKey, obj.inovKey, obj.pracKey );
        pracIdx.value++;
        if( debug ) {
          console.log( 'Prac.onPrac()', { pracIdx:pracIdx.value, pracObj:pracObj.value, pracKey:obj.pracKey } ); } }

      const onNav = (obj) => {
        if( nav.isMyNav(obj,'Prac') ) {
          onPrac(obj); } }

      const toPracKey = (pracKey) => {
        if( pracKey==='None' ) {
          console.log( 'Prac.setPrac() pracKey is None', { compKey:nav.compKey, inovKey:nav.inovKey } );
          if(      nav.compKey==='Info') { return 'Team';    }
          else if( nav.compKey==='Know') { return 'Involve'; }
          else if( nav.compKey==='Wise') { return 'Trust';   } }
        else {
          return pracKey; }
      }

      onBeforeMount( () => {
        // nav.setPages( 'Prac', pages );
        let obj = {}
        obj.compKey = nav.compKey;
        obj.pracKey = toPracKey(nav.pracKey);
        obj.inovKey = nav.inovKey;
        onPrac( obj );  } )

      onMounted( () => {
        // console.log( 'Prac.onMounted()')
        mix.subscribe(  "Nav", 'Prac', (obj) => {
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


if( !mix.isDef(pracObj.value) || pracObj.value.name !== obj.pracKey ) {
-->

