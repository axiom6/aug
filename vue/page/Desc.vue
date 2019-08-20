
<template>
  <div v-show="isPage()" class="desc" prac="prac" @click="doPrac(prac)">
    <i :class="prac.icon"></i>
  </div>
</template>

<script type="module">

  let Desc = {

    props: { comp:String, prac:Object },

    data() { return { page:"None"} },

    methods: {

      isPage:  function() {
        return this.page === 'Desc'; },
      onPage:  function(page) {
        return this.page = page; },
      doPrac: function(name) {
        publish( this.comp, name ); } },

    mounted: function () {
      this.subscribe( 'Page', 'Icon.vue', (page) => this.onPage(page) ); }
  }

  export default Desc;

</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .desc { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;
    background-color:@theme-back; color:@theme-color; font-size:@theme-h1-size; text-align:center; }
</style>