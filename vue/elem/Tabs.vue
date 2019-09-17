
<template>
  <div class="tabs">
    <template v-for="pageObj in pages">
      <div :class="clPage(pageObj.name)" @click="doPage(pageObj.key)">{{pageObj.name}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { pages:Object },
    
    data() { return { pageKey:'None', pageObj:null } },
    
    methods: {
      onPage: function (pageKey) {
        this.pageKey  = pageKey; },
      doPage: function (pageKey) {
        this.onPage( pageKey )
        let obj = { pageKey:pageKey };
        if( this.isDef(this.pages[pageKey].route) ) {
          obj.route =  this.pages[pageKey].route }
        this.nav().pub( obj ); },
      clPage: function (pageKey) {
        return this.pageKey===pageKey ? 'tab-active' : 'tab'; } },

    beforeMount: function() {
      this.onPage(this.nav().pageKey); },

    mounted: function() {
        this.subscribe(  "Nav", 'Tabs', (obj) => {
          this.onPage(obj.pageKey); } ); }
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