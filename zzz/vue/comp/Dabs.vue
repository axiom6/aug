
<template>
  <div class="dabs">
    <template v-for="pageObj in pages">
      <div :class="classTab(pageObj.key)" @click="doPage(pageObj.key)">{{pageObj.title}}</div>
    </template>
  </div>
</template>

<script type="module">

  export default {

    props: { route:String, pages:Object },

    data() { return { pageKey:'None', pageObj:null } },

    methods: {
      onPage: function (obj) {
        if( this.route === obj.route ) {
            this.pageKey = obj.pageKey; } },
      doPage: function(pageKey) {
        this.onPage( pageKey );
        this.nav().pub( { route:this.route, pageKey:pageKey } ); },
      classTab: function (pageKey) {
        return this.pageKey===pageKey ? 'tab-active' : 'tab'; } },

    mounted: function () {
      this.nav().setPages( this.route, this.pages );
      this.subscribe( 'Nav', 'Dabs.vue', (obj) => {
          this.onPage(obj); } ); }

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