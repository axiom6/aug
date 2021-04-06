
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';


  export default {

    props: { route:String, pages:Object, position:{ default:'full', type:String } },
    
    data() { return { pageKey:'None', pageObj:null,
      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
    
    methods: {
      doTabs: function () {
        this.mix = inject('mix');
        this.nav.setPages(this.route,this.pages); // Will only set pages if needed
        let first   = this.pageKey==='None'; // && !this.mix.hasInov(this.route);
        let pageKey = this.nav.getPageKey(this.route);
        // console.log( 'Tabs.init()', obj, { route:this.route, pageKey:pageKey, pages:this.pages } );
        if( first ){ this.doPage(pageKey); }
        else       { this.onPage(pageKey); } },
      isPage: function (pageKey) {
        // console.log( 'Tabs.isPage()', { route:this.route, pageKey:pageKey }  );
        return this.mix.isDef(this.route) && this.mix.isDef(pageKey); },
      onPage: function (pageKey) {
        if( this.isPage(pageKey) ) {
          this.pageKey = pageKey;
          this.nav.setPageKey( this.route, pageKey ); }
        else {
          console.log( 'Tabs.onPage() bad pageKey', { route:this.route, pageKey:pageKey } ); } },
      doPage: function (pageKey) {
        if( this.isPage(pageKey) ) {
            this.onPage(pageKey) ;
            let obj = { source:'Tabs',route:this.route }
            obj.inovKey = 'None'; // this.mix.hasInov(this.route) ? pageKey : 'None';
             this.nav.pub(obj); } },
      stylePos: function () {
        return this.positions[this.position]; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

    mounted: function() {
      this.mix = inject('mix');
      this.nav = inject('nav');
      this.doTabs();
      // console.log( 'Tabs.onMounted()', { route:this.route, pages:this.pages } );
      this.mix.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs'  ) { // && obj.route === this.route
          this.$nextTick( function() {
            this.doTabs(); } ); } } ); }
    }
  
</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
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