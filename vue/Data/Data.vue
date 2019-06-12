

<template>
  <div class="data" ref="Data">
    <h1 :v-if="isData()">Data</h1>
    <router-view :name="Tables"></router-view>
    <router-view :name="Pivots"></router-view>
  </div>
</template>

<script type="module">
  
  let Data = {

    data() { return { comp:'Data' } },

    methods: {
      isData: function() {
        return this.comp === 'Data'; }
    },

    mounted: function () {}

  }

  export default Data;

</script>

<style lang="less">
  
  .data {   position:relative; left:0; top:0; right:0; bottom:0; background-color:black; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } }
  
</style>;