
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template :key="tabsIdx" v-for="pageObj in pages">
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

      const mix     = inject('mix');
      const nav     = inject('nav');

      const pagesName = () => {
        if(      props.isComp ) { return 'CompPages';           }
        else if( props.isInov ) { return props.compKey+'Inovs'; }
        else                    { return props.compKey;         } }

      const getPageKey = () => {

        if( props.isComp && nav.inArray(nav.level,nav.museLevels) && nav.pageKey!=='None' ) {
          return nav.pageKey; }
        else {
          return nav.getPageDef(props.pages); } }

      let   tabsIdx = ref(0);
      const source  = props.isInov ? 'TabsInov'+props.compKey : 'TabsNorm'+props.compKey
      nav.setPages( pagesName(), props.pages );
      const pageKey = ref(getPageKey());
      console.log( 'Tabs.getPageKey()', { pageKey:pageKey.value, pageNav:nav.pageKey, isComp:props.isComp,
        isLevel:nav.inArray(nav.level,nav.museLevels) } );
      const pageObj = ref(null);

      const positions = {
        left: {left: 0, width: '60%'},
        right: {left: '60%', width: '40%'},
        full: {left: 0, width: '100%'} };
      
      const onPage = (pageArg) => {
        if( nav.hasPage(props.pages,pageArg) ) {
          pageKey.value = pageArg;
          nav.setPageKey( pagesName, pageArg );
          tabsIdx.value++; }
        else {
          console.log( 'Tabs.onPage() pageKey not in pages', { source:source, pageKey:pageArg, pages:props.pages } ) } }

      const doPage = (pageArg) => {
        onPage(pageArg);
        let obj = { source:'Tabs', compKey:props.compKey };
        if( props.isInov ) {
          obj.inovKey = pageArg; }
        else {
          obj.pageKey = pageArg; }
        nav.pub(obj); }

      const stylePos = () =>  {
        return positions[props.position]; }

      const classTab = (pageArg) => {
        console.log( 'Tabs.classTab', { source:source, pageKey:pageKey.value, pageArg:pageArg } )
        return pageKey.value === pageArg ? 'tabs-tab-active' : 'tabs-tab'; }

      const onNav = (obj) => {
        if( obj.source!==source && obj.pageKey!==pageKey.value ) {
           let pageArg = props.isInov ? obj.inovKey : obj.pageKey;
           onPage( pageArg ); } }

      onMounted( () => {
        mix.subscribe(  "Nav", source, (obj) => {
          onNav(obj); } ) } )

      return { pageObj, tabsIdx, doPage, classTab, stylePos } }
  }

  export default Tabs;
  
</script>

<style scoped lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @tabsFS:1.5*@themeFS;
  
  .tabs-pane { background-color:@theme-back; font-size:@tabsFS; // @theme-tabs-height*0.5
    position:absolute; left:0; top:1%; width:@theme-tabs-width; height:@theme-tabs-height;
    
    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border: @theme-fore solid thin;
                                    background-color:@theme-back; color:@theme-fore; }
    .tabs-tab:hover  {              background-color:@theme-hove; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }
  
</style>

<!--
  console.log( 'Tabs.setup()', { pageKey:pageKey.value } );

  console.log( 'Tabs.onNav()', { source:obj.source, compKey:props.compKey, isInov:props.isInov,
    has:nav.hasPage(props.pages,obj.pageKey), tabPageKey:pageKey.value, objPageKey:obj.pageKey } );

  console.log('Tabs.onPage()', { compKey:props.compKey, pageArg:pageArg, source:source } );

  const isPage = (pageArg) => {
    return mix.isDef(props.compKey) && mix.isDef(pageArg); }

  const onPage = (pageArg) => {
    pageKey.value = pageArg;
    if( isPage(pageArg) ) {
      console.log('Tabs.onPage()', { compKey:props.compKey, pageArg:pageArg, source:source } );
      nav.setPageKey( props.compKey, pageArg );
      tabsIdx.value++; }
    else {
      console.log('Tabs.onPage() bad pageKey', { compKey:props.compKey, pageKey:pageArg } ); } }

  border-left: @theme-fore solid thin;
        border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;
        const init = function ()  {
          nav.setPages(props.compKey,props.pages); // Will only set pages if needed
          let pageArg = nav.getPageKey(props.compKey);
          console.log( 'Tabs.init()', { compKey:props.compKey, pageKey:pageKey.value, pages:props.pages } );
          onPage(pageArg); }

        onMounted( function() {
          mix.subscribe(  "Nav", 'Tabs.'+props.compKey, (obj) => {
            if( obj.source !== 'Tabs'  ) {
              nextTick( function() {
                init(); } ) } } ) } )
-->