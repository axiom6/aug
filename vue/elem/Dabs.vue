
<template>
  <div class="dabs">
    <template v-for="page in pages">
      <div :class="classTab(page.key)" @click="pubTab(page.key)">{{page.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { comp:String, pages:Object, init:String },

    data() { return { key:this.init } },

    methods: {
      pubTab: function (key) {
        this.key = key;
        this.publish( this.comp, key ); },
      classTab: function (key) {
        return this.key===key ? 'tab-active' : 'tab'; } },

    mounted: function () {}

  }

</script>

<style lang="less">
  
  .dabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; font-size:1.5em;
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: wheat solid thin;
      border-top:wheat solid thin; border-right:wheat solid thin;
      background-color:black; color:wheat; }
    .tab:hover  {         background-color:wheat; color:black; }
    .tab-active { .tab(); background-color:wheat; color:black; } }

</style>