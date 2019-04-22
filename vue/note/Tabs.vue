
<template>
  <div class="tabs">
    <template v-for="page in pages">
      <div :class="classTab(page.short)" @click="pubTab(page.short)">
        <router-link :to="{ name:name(page) }">{{page.title}}</router-link>
      </div>
    </template>
  </div>
</template>

<script type="module">

  export default {
    
    data() { return { tab:'Stand' } },

    props: { comp:String, pages:Array },

    methods: {
      pubTab: function (tab) {
        this.tab = tab;
        this.publish( 'Tabs', tab ); },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab'; },
      name: function(page) {
        return this.comp+page.short; } },

    mounted: function () {}
    
    }
  
</script>

<style lang="less">
  
  .tabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; font-size:1.5em;
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: wheat solid thin;
      border-top:wheat solid thin; border-right:wheat solid thin;
      a         { background-color:black; color:wheat; text-decoration:none; } }
    .tab:hover  { background-color:wheat; color:black;
      a         { background-color:wheat; color:black } }
    .tab-active { background-color:wheat; color:black; .tab();
      a         { background-color:wheat; color:black !important; text-decoration:none; } } }
  
</style>