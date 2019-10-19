
<template>
  <div class="math-pane" ref="Math">
    <h1 v-if="route==='Math'">Mathematics</h1>
    <template v-for="math in maths">
      <router-view :name="route+math.key"></router-view>
    </template>
  </div>
</template>

<script type="module">

  let Math = {

    data() { return { route:'Math',
      maths:[
        { title:'MathML', key:'ML' },
        { title:'MathEQ', key:'EQ' } ] } },

    mounted: function () {} 

  }

  export default Math;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  @mathFS:@themeFS;
  
  .math-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-back; display:grid;
    h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@mathFS; } }

</style>