
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pagesKey:String, pages:Object, position:{ default:'full', type:String } },
    
    data() { return { pageKey:'None', pageObj:null,
      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
    
    methods: {
      onPage: function (pageKey) {
        if( this.mix().isDef(pageKey) ) {
          this.pageKey = pageKey;
          this.mix().nav().setPageKey( this.pagesKey, this.pageKey ); }
        else {
          console.error( 'Tabs.vue.onPage() bad pageKey', pageKey ); } },
      doPage: function (key) {
          this.onPage( key );
          let nav = this.mix().nav();
          let inovKey = this.route === 'Inov' ? key : nav.inovKey;
          let obj = { source:'Tabs',route:this.route, inovKey:inovKey, pageKey:key };
          this.mix().nav().pub( obj ); },
      stylePos: function () {
        return this.positions[this.position]; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

    mounted: function() {
      this.onPage( this.mix().nav().getPageKey( this.pagesKey ) )
      this.mix().subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs' && obj.route === this.route ) {
          this.onPage( obj.pageKey ); } } ); } 
    }
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @tabsFS:1.5*@themeFS;
  
  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;
    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;
    
    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;
      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;
      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;
                                    background-color:@theme-back; color:@theme-fore; }
    .tabs-tab:hover  {              background-color:@theme-hove; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }
  
</style>