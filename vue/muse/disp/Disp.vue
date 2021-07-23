
<template>
  <div class="disp-pane">
    <d-tabs :compKey="'Disp'" :pages="pages"></d-tabs>
    <div :key="nav.keyIdx(dispObj['name'],dispIdx)">
      <d-dims v-if="nav.isShow('Disp','Topics')" :dispObj="dispObj" :from="'Disp'"></d-dims>
      <d-desc v-if="nav.isShow('Disp','Texts')"  :dispObj="dispObj" :from="'Disp'"></d-desc>
    </div>
  </div>
</template>

<script type="module">

  import Tabs from '../../../lib/vue/elem/Tabs.vue';
  import Dims from '../prac/Dims.vue';
  import Desc from './Desc.vue';
  import { inject, ref, onBeforeMount, onMounted } from 'vue'
  
  let Disp = {

    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },

    setup() {

      const nav     = inject( 'nav' );
      const dispObj = ref(null);
      const dispIdx = ref(0);
      const debug   = false;
      const pages   = nav.getTabs('Disp')

      const onDisp = function( obj ) {
        dispObj.value = nav.dispObject( obj.compKey, obj.inovKey, obj.pracKey, obj.dispKey );
        dispIdx.value++;
        if( nav.isDef(dispObj.value) ) {
          if( debug ) {
            console.log('Disp.onDisp()', { pageKey:obj.pageKey, dims:pages['Topics'].show, desc:pages['Texts'].show } );
            console.log('Disp.onDisp()',
                { comp:obj.compKey, inov:obj.inovKey, prac:obj.pracKey, disp:obj.dispKey, dispObj:dispObj.value } ); } }
        else {
          console.error('Disp.onDisp() disp null',
              { comp:obj.compKey, inov:obj.inovKey, prac:obj.pracKey, disp:obj.dispKey } ); }
      }

      const onNav =  function (obj) {
        if( nav.isMyNav(obj,'Disp') ) {
            onDisp( obj ); } }

      onBeforeMount( function () {
        // nav.setPages( 'Disp', pages );
        let obj = {}
        obj.compKey = nav.compKey;
        obj.pracKey = nav.pracKey;
        obj.inovKey = nav.inovKey;
        obj.dispKey = nav.dispKey;
        obj.pageKey = nav.getPageKey('Disp');
        onDisp( obj );  } )

      onMounted( function () {
        nav.subscribe(  "Nav", 'Disp', (obj) => {
          onNav(obj); } ); } )

    return { pages, dispObj, dispIdx, nav } }
  }
  
  export default Disp;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; }
  
</style>

