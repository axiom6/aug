
<template>
  <div class="tabs-pane" :style="stylePos()">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pages:Object, compKey:String, defn:{ default:'null', type:String },
             position:{ default:'full', type:String } },
    
    data() { return { pageKey:'None', pageObj:null,
      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
    
    methods: {
      onPage: function (key) {
        if( key !== 'None') {
          this.pageKey = key;
          this.mix().nav().setPageKey( this.route, key ); } },
      doPage: function (key) {
          this.onPage( key );
          let inovKey = this.route === 'Inov' ? key : 'None'
          this.mix().nav().pub( { source:'Tabs', route:this.route, compKey:this.compKey, pageKey:key, inovKey:inovKey } ); },
      stylePos: function () {
        return this.positions[this.position]; },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

    created: function () {  // We want to set the routes pages asap
      this.onPage( this.mix().nav().setPages( this.route, this.pages, this.defn ) ); },

    mounted: function() {
      this.mix().subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
        if( obj.source !== 'Tabs' && obj.route === this.route ) {
          this.onPage( obj.pageKey ); } } ); }  // this.mix().nav().getPageKey(this.route)
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
                  background-color:@theme-back;  color:@theme-fore;}
    .tabs-tab:hover  {         background-color:@theme-fore; color:@theme-back; }
    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }
  
</style>