

<template>
  <div>
  <template v-for="row in rows">
    <div v-show="isRows()" :class="row.dir" :key="row.name"><div class="row">
      <div><i :class="row.icon"></i>{{row.name}}</div></div></div>
  </template>
  </div>
</template>

<script type="module">

  export default {

    data() { return { prac:'All',
      rows: {
        Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
        Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },

    methods: {
      isRows: function () {
        return this.prac==='All' } },

    mounted: function () {}
  }

</script>

<style lang="less">
  
  .comp { background-color:black; position:relative; font-size:1.75vmin;
  
  
    div .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1em;
         font-weight:bold; display:grid;
    div { text-align:center; justify-self:center;  align-self:center; font-size:1.8em; color:wheat; }
    i { margin-bottom: 0.2em; display:block; } }
  }
  
</style>