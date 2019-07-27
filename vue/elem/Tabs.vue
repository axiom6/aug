
<template>
  <div class="tabs">
    <template v-for="page in pages">
      <div :class="classTab(page.key)" @click="pubTab(page.key)">{{page.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Array },
    
    data() { return { tab:"" } },  // tab is a page.key
    
    methods: {
      onTab: function (obj) {
        if( obj.level === 'Tabs' && this.tab !== obj.tab ) {
          this.$router.push( { name:this.comp+obj.tab } ); // Programmed router
          this.tab = obj.tab; } },                         // Tab active with classTab
      pubTab: function (tab) {
        this.nav().set( { tab:tab               } );
        this.nav().pub( { tab:tab, level:"Tabs" } ); },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab'; } },
    
    mounted: function() {
      this.subscribe(  "Nav", 'Tabs', (obj) => {
        this.onTab(obj); } ); }
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