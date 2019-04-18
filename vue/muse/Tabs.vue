
<template>
  <div class="tabs">
    <div :class="classTab('Practices')"    @click="pubTab('Practices')">
      <router-link :to="{ name:comp+'Prac' }">Practices</router-link>
    </div>
    <div :class="classTab('Connections')"  @click="pubTab('Connections')">
      <router-link :to="{ name:comp+'Conn'}">Connections</router-link>
    </div>
    <div :class="classTab('Enlight')"      @click="pubTab('Enlight')"     >
      <router-link :to="{ name:comp+'Enli'}">Enlight</router-link>
    </div>
    <div :class="classTab('Data Science')" @click="pubTab('Data Science')">
      <router-link :to="{ name:comp+'Data'}">Data Science</router-link>
    </div>
  </div>
</template>

<script type="module">

  export default {
    
    data() {
      return { tab:'Practices' } },

    props: { comp:String },

    methods: {
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
      a         { background-color:black; color:wheat; text-decoration:none; } }
    .tab:hover  { background-color:wheat; color:black;
      a         { background-color:wheat; color:black } }
    .tab-active { background-color:wheat; color:black; .tab();
      a         { background-color:wheat; color:black !important; text-decoration:none; } } }
  
</style>