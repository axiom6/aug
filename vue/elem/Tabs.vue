
<template>
  <div class="tabs">
    <template v-for="page in pages">
      <div :class="classTab(page.key)" @click="pubTab(page.key)">
        <router-link :to="{ name:name(page) }">{{page.title}}</router-link>
      </div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Array, init:String },
    
    data() { return { tab:this.init } },
    
    methods: {
      pubTab: function (tab) {
        this.tab = tab;
        this.publish( 'Tabs', tab ); },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab'; },
      name: function(page) {
        return this.comp+page.key; } },

    mounted: function () {}
    
    }
  
</script>

<style lang="less">
  
  @import '../dash/theme.less';
  
  .tabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:@theme-back; font-size:1.5em;
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;
      border-top:@theme-color solid thin; border-right:@theme-color solid thin;
      a         { background-color:@theme-back;  color:@theme-color; text-decoration:none; } }
    .tab:hover  { background-color:@theme-color; color:@theme-back;
      a         { background-color:@theme-color; color:@theme-back } }
    .tab-active { background-color:@theme-color; color:@theme-back; .tab();
      a         { background-color:@theme-color; color:@theme-back!important; text-decoration:none; } } }
  
</style>