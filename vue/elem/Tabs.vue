
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
    
    data() { return { pageKey:'None', pageObj:null } },
    
    methods: {
      onPage: function (key) {
        if( key !== 'None') {
          this.pageKey = key; } },
      doPage: function (key) {
        if( key!=='None' ) {
          if( this.route!=='Inov' ) {
              this.nav().setPageKey( this.route, key ); }
          this.onPage( key );
          this.nav().pub( this.pubObj(key) ); } },
      pubObj: function (key) {
        return this.route==='Inov'
                ? { source:'Tabs', route:'Comp',     compKey:key }
                : { source:'Tabs', route:this.route, pageKey:key }; },
      pubObj2: function (key) {
        return { source:'Tabs', route:this.route, pageKey:key }; },
      stylePos: function () {
        return this.position==='right' ? { left:'50%' } : { left:0 }; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

    beforeMount: function () {  // We want to set the routes pages asap
      this.onPage( this.nav().setPages( this.route, this.pages ) ); },

    mounted: function() {
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