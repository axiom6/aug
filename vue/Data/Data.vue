

<template>
  <div class="data" ref="Data">
    <h1 :v-if="isData()">Data</h1>
    <template v-for="dat in datas">
      <router-view :name="dat.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  let Data = {

    data() { return { comp:'Data', datas:[
      { title:'Tables', key:'Tables' },
      { title:'Pivots', key:'Pivots' } ] } },

    methods: {
      isData: function() {
        return this.comp === 'Data'; } },

    mounted: function () {}

  }

  export default Data;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .data {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }
  
</style>;