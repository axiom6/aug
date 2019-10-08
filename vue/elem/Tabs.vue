
<template>
  <div class="tabs">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pages:Object },
    
    data() { return { tabsKey:'None', pageKey:'None', pageObj:null } },
    
    methods: {
      onPage: function (tabsKey) {
        if( tabsKey !== 'None') {
          this.pageKey = tabsKey; } },
      doPage: function (pageKey) {
        this.nav().dirTabs = this.app() !== 'Muse';
        if( pageKey !== 'None') {
          this.onPage( pageKey );
          this.nav().setPageKey( this.route, pageKey );
          this.nav().pub( this.pubObj(pageKey) ); } },
      pubObj: function (pageKey) {
        let obj   = { source:'Tabs', route:this.route, pageKey:pageKey }
        let poute = this.pages[pageKey].route;
        if( this.isDef(poute) ) {
            obj.poute = poute; }
        return obj; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tab-active' : 'tab'; } },

    beforeMount: function () {  // We want to set the routes pages asap
      this.tabsKey = this.nav().setPages( this.route, this.pages ); },

    mounted: function() {
      this.onPage(this.tabsKey);
      this.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs' && obj.route === this.route ) {
          this.onPage( this.nav().getPageKey(this.route,'None') ); } } ); }
    }
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .tabs { position:absolute; left:0; top:0; width:100%; height:5%;
          background-color:@theme-back; font-size:@theme-tab-size;
    .tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;
      border-top:@theme-color solid thin; border-right:@theme-color solid thin;
                  background-color:@theme-back;  color:@theme-color;}
    .tab:hover  {         background-color:@theme-color; color:@theme-back; }
    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }
  
</style>