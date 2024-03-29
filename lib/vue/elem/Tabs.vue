
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages" :key="pageKeyIdx(pageObj)">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

import { inject, ref, onMounted } from 'vue';

  let Tabs = {

    props: { compKey:String, pages:Object, position:{  type:String, default:'full' },
             isInov:{ type:Boolean, default:false }, isComp:{ type:Boolean, default:false }  },

    setup(props) {

      const nav     = inject('nav');
      let   tabsIdx = 0;
      const pageObj = ref(null);
      let   compKey = props.isComp ? 'Comp' : props.compKey;
      const pageKey = ref( nav.getPageKey( compKey, true ) );
      const debug   = false;
      if( debug ) { console.log( 'Tabs.setup()', {pageKey:pageKey.value,compKey:compKey,pages:nav.getTabs(compKey)}); }

      const positions = {
        left:  { left:0,     width: '60%'  },
        right: { left:'60%', width: '40%'  },
        full:  { left:0,     width: '100%' } };

      const pageKeyIdx = ( pageObj ) => {
        return pageObj.key + tabsIdx; }

      const onPage = (pageArg) => {
        if( nav.hasTabs( compKey,true) ) {
          pageKey.value = pageArg;
          nav.setPageKey( compKey, pageArg, props.pages );
          if( debug ) { console.log( 'Tabs.onPage()', { compKey:compKey, pageKey:pageArg, pages:props.pages } ); }
          tabsIdx++; }
        else {
          console.log( 'Tabs.onPage() missing pageKey', { pageKey:pageArg, pages:nav.getTabs(compKey) } ) } }

      const doPage = (pageArg) => {
        onPage(pageArg);
        let obj = { source:'Tabs' }; // Using prop.compKey
        if( props.isInov ) { obj.inovKey = pageArg; } else { obj.pageKey = pageArg; }
        if( debug ) { console.log( 'Tabs.doPage()', obj ); }
        nav.pub(obj); }

      const stylePos = () =>  {
        return positions[props.position]; }

      const classTab = (pageArg) => {
        // if( debug ) { console.log( 'Tabs.classTab', { pageKey:pageKey.value, pageArg:pageArg } ) }
        return pageKey.value === pageArg ? 'tabs-tab-active' : 'tabs-tab'; }

      onMounted( () => {  // obj is tab obj and not a complete pub obj
        nav.subscribe('Tab', 'Tabs', (obj) => {
          if( compKey===obj.compKey ) {
            onPage(obj.pageKey); } } ); } )

      return { pageObj, pageKeyIdx, doPage, classTab, stylePos } }
  }

  export default Tabs;

</script>

<style scoped lang="less">

  @import '../../css/themes/theme.less';

  @tabsFS:1.5*@themeFS;

  .tabs-pane { background-color:@theme-back; font-size:@tabsFS; // @theme-tabs-height*0.5
    position:absolute; left:0; top:1%; width:@theme-tabs-width; height:@theme-tabs-height;

    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border: @theme-fore solid thin;
                                    background-color:@theme-back; color:@theme-fore; }
    .tabs-tab:hover  {              background-color:@theme-hove; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }

</style>
