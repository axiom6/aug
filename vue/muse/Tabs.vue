
<template>
  <div class="tabs">
    <div :class="classTab('Practices')"   >
      <router-link :to="toName()">Practices</router-link>
    </div>
    <div :class="classTab('Connections')">
      <router-link :to="{ name:'Conn' }">Connections</router-link>
    </div>
    <div :class="classTab('Enlight')"      @click="pubTab('Enlight')"     >Enlight</div>
    <div :class="classTab('Data Science')" @click="pubTab('Data Science')">Data Science</div>
  </div>
</template>

<script type="module">

  export default {
    
    data() {
      return { tab:'Practices' } },

    methods: {
      toName: function () {
        console.log( 'Tabs.toName()', this.$route.name );
        return { name:this.$route.name } },
      pubTab: function (tab) {
        this.tab = tab;
        this.publish( 'Tabs', tab ); },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab'; } },

    mounted: function () {}
    
    }
  
</script>

<style lang="less">
  
  .tabs {
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: wheat solid thin;
      border-top:wheat solid thin; border-right:wheat solid thin;
      a         { color:wheat; text-decoration:none; } }
    .tab:hover  { background-color:wheat; color:black; }
    .tab-active { background-color:wheat; color:black; .tab();
      a         { color:black; text-decoration:none; } } }
  
</style>