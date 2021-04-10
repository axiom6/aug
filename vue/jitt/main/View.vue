
<template>
  <div ref="viewElem" class="view-pane">
    <router-view name="Home"></router-view>
    <router-view name="Flavor"></router-view>
    <router-view name="Roast"></router-view>
    <router-view name="Brew"></router-view>
    <router-view name="Drink"></router-view>
    <router-view name="Body"></router-view>
    <router-view name="World"></router-view>
    <router-view name="Region"></router-view>
    <router-view name="Done"></router-view>
  </div>
</template>

<script type="module">

  import {inject, ref, onMounted, nextTick } from 'vue'
  
  let View =
  {

    setup() {

      const nav      = inject('nav');
      const viewElem = ref(null);

      const show = function () {
         return nav.route === null; }

      onMounted( function () {
         nextTick(function () {
          let elem = viewElem.value;
          let touchClasses = ['view-pane'];
          nav.touch.listen( elem, touchClasses ); } ) } )

    return { show, viewElem }; }
  }

  export default View;

</script>

<style lang="less">
     .view-pane {}
</style>



