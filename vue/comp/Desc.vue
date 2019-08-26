
<template>
  <div class="desc" prac="prac" @click="doPrac(prac)">
    <i :class="prac.icon"></i>
  </div>
</template>

<script type="module">

  let Desc = {

    props: { comp:String, prac:Object },

    data() { return { page:"Desc"} },

    methods: {

      isPage:  function() {
        return this.nav().page === 'Desc'; },
      doPrac: function(name) {
        publish( this.comp, name ); } },

    mounted: function () {} }

  export default Desc;

</script>

<style lang="less">
  @import '../../pub/css/themes/theme.less';
  .desc { display:grid; align-self:stretch; justify-self:stretch; align-items:center; justify-items:center;
    background-color:@theme-back; color:@theme-color; font-size:@theme-h1-size; text-align:center; }
</style>