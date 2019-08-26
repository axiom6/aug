
<template>
  <div class="tabs">
    <template v-for="page in pages">
      <div :class="clPage(page.page)" @click="doPage(page)">{{page.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Array },
    
    data() { return { page:"" } },
    
    methods: {
      onPage: function (obj) {
        this.page = obj.page; },
      doPage: function (page) {
        this.nav().pub( { page:page.page } ); },
      clPage: function (page) {
        return this.page===page ? 'tab-active' : 'tab'; } },
    
    mounted: function() {
      this.subscribe(  "Nav", 'Page', (obj) => {
        this.onPage(obj); } ); }
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