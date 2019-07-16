
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

    mounted: function () {
      this.subscribe( 'Geom', 'Dabs.vue', (key) => {
        this.classTab(key) } ); }

  }

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .dabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:@theme-back;
    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;
      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;
      border-top:@theme-color solid thin; border-right:@theme-color solid thin;
      background-color:@theme-back; color:@theme-color; }
    .tab:hover  {         background-color:@theme-color; color:@theme-back; }
    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }

</style>