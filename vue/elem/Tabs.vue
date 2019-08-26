
<template>
  <div class="tabs">
    <template v-for="page in pages">
      <div :class="clPage(page.name)" @click="doPage(page)">{{page.name}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Object },
    
    data() { return { page:"" } },
    
    methods: {
      onPage: function (page) {
        // console.log( 'Tabs.onPage()', { page:page, tabs:this.page } );
        this.page = page; },
      doPage: function (page) {
        this.nav().pub( { page:page.name } ); },
      clPage: function (name) {
        return this.page===name ? 'tab-active' : 'tab'; } },

    beforeMount: function() {
      this.onPage(this.nav().page); },

    mounted: function() {
        this.subscribe(  "Nav", 'Tabs', (obj) => {
          this.onPage(obj.page); } ); }
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