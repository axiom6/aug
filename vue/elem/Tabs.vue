
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pages:Object, position:String },
    
    data() { return { tabPages:null, tabsKey:'None', pageKey:'None', prevKey:'None', pageObj:null } },
    
    methods: {
      onPage: function (tabsKey) {
        if( tabsKey !== 'None') {
          if( !this.isPageKeyComp(this.pageKey) ) {
               this.prevKey = this.pageKey; }
          this.pageKey = tabsKey; } },
      doPage: function (pageKey) {
        this.nav().dirTabs = this.app() !== 'Muse';
        if( pageKey!=='None' ) {
          this.onPage( pageKey );
          this.nav().setPageKey( this.route, pageKey );
          this.nav().pub( this.pubObj(pageKey) ); } },
      pubObj: function (pageKey) {
        let route = this.route==='Inov' ? 'Comp' : this.route;
        let obj   = { source:'Tabs', route:route, pageKey:pageKey, prevKey:this.prevKey };
        if( this.route==='Inov' ) {
          obj.compKey = pageKey; }
        return obj; },
      stylePos: function () {
        return this.position==='right' ? { left:'50%' } : { left:0 }; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

    beforeMount: function () {  // We want to set the routes pages asap
      this.tabsKey  = this.nav().setPages( this.route, this.pages ); },

    mounted: function() {
      this.onPage(this.tabsKey);
      this.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs' && obj.route === this.route ) {
          this.onPage( this.nav().getPageKey(this.route,'None') ); } } ); }
    }
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @tabsFS:1.7*@themeFS;
  
  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;
    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;
    
    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;
      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;
                  background-color:@theme-back;  color:@theme-fore;}
    .tabs-tab:hover  {         background-color:@theme-fore; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }
  
</style>