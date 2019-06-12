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

  let Pivot = {

    components:{ 'd-tabs':Tabs },

    data() {
      return { comp:'Pivot', key:'Pivot',
        pages:[
          { title:'Pivot1', key:'Pivot1' },
          { title:'Pivot2', key:'Pivot2' } ] } },

    methods: {},

    mounted: function () {}
  }

  export default Pivot;

</script>

<style lang="less">
  
  .page { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black; display:grid; }

</style>