
<template>
  <div class="dabs">
    <template v-for="page in pages">
      <div :class="classTab(page.short)" @click="pubTab(page.short)">{{page.title}}</div>
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
        this.publish( this.comp, tab ); },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab'; },
      name: function(page) {
        return this.comp+page.short; } },

    mounted: function () {}

  }

</script>

<style lang="less">
  
  .dabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; font-size:1.5em;
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: wheat solid thin;
      border-top:wheat solid thin; border-right:wheat solid thin;
      background-color:black; color:wheat; }
    .tab:hover  { background-color:wheat; color:black; }
    .tab-active { background-color:wheat; color:black; .tab(); } }

</style>