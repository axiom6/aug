

<template>
  <div class="data" ref="Data">
    <h1 :v-if="isData()">Data</h1>
    <template v-for="data in datas">
      <router-view :name="data.title"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  let Data = {

    data() { return { comp:'Data',
      datas:[
        { title:'Table'  },
        { title:'Pivot'  } ] } },

    methods: {
      isData: function() {
        return this.comp === 'Data'; }
    },

    mounted: function () {}

  }
  
  import Table from './Table.vue';
  import Pivot from './Pivot.vue';
  
  Data.Table = Table;
  Data.Pivot = Pivot;

  export default Data;

</script>

<style lang="less">
  
  .data {   position:relative; left:0; top:0; right:0; bottom:0; background-color:black; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } }
  
</style>;