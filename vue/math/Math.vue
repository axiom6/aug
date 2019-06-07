
<template>
  <div class="math" ref="Math">
    <h1 v-if="comp==='Math'">Mathematics</h1>
    <template v-for="math in maths">
      <router-view :name="comp+math.key"></router-view>
    </template>
  </div>
</template>

<script type="module">

  let Math = {

    data() { return { comp:'Math',
      maths:[
        { title:'MathML', key:'ML' },
        { title:'MathEQ', key:'EQ' } ] } },

    mounted: function () {} 

  }

  export default Math;

</script>

<style lang="less">
  
  .math {   position:relative; left:0; top:0; right:0; bottom:0; background-color:black; display:grid;
    h1    { justify-self:center; align-self:center; text-align:center; color:wheat; font-size:3em; } }

</style>