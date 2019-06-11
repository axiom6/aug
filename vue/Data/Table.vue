
<template>
  <div>
    <d-tabs comp="Data" :pages="pages" :init="key"></d-tabs>
    <template v-for="page in pages">
      <router-view :name="page.title" class="page" :id="page.key"></router-view>
    </template>
  </div>
</template>

<script type="module">
  
  import Tabs  from '../elem/Tabs.vue';
  
  let Table = {
    
    components:{ 'd-tabs':Tabs },

    data() {
      return { comp:'Table', key:'Table',
        pages:[
          { title:'Table1', key:'Table1' },
          { title:'Table2', key:'Table2' } ] } },

    methods: {},

    mounted: function () {}
  }
  
  export default Table;

</script>

<style lang="less">
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black; display:grid; }

</style>