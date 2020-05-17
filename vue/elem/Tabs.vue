
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pages:Object, position:{ default:'full', type:String } },
    
    data() { return { pageKey:'None', pageObj:null,
      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
    
    methods: {
      onPage: function (pageKey) {
        if( this.mix().isDef(this.route) && this.mix().isDef(pageKey) ) {
          this.pageKey = pageKey;
          this.mix().nav().setPageKey( this.route, pageKey ); }
        else {
          console.log( 'Tabs.onPage() bad pageKey', { route:this.route, pageKey:pageKey } ); } },
      doPage: function (pageKey) {
          this.onPage(  pageKey );
          let obj = { source:'Tabs',route:this.route }
          obj.inovKey = this.mix().hasInov(this.route) ? pageKey : 'None';
          this.mix().nav().pub(obj); },
      stylePos: function () {
        return this.positions[this.position]; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },
    mounted: function() {
      this.mix().nav().setPages( this.route, this.pages );
      let  pageKey = this.mix().nav().getPageKey(this.route);
      this.onPage( pageKey );
      // console.log( 'Tabs.mounted()', { route:this.route, pageKey:pageKey, pages:this.pages } );
      this.mix().subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs'  ) { // && obj.route === this.route
          this.$nextTick( function() {
            if( !this.mix().nav().hasPages(this.route,false) ) {
              this.mix().nav().setPages( this.route, this.pages ); }
            let  pageKey = this.mix().nav().getPageKey(this.route);
            // console.log( 'Tabs.subscribe()', obj, { route:this.route, inovKey:obj.inovKey, pageKey:pageKey, pages:this.pages } );
            this.onPage(pageKey); } ); } } ); }
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