
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

      const show = () => {
         return nav.route === null; }

      onMounted( () => {
        let outTouch = ['navb-name-desktop','navb-name-mobile','btns-btn','title']
        nav.mountTouch( "View", viewElem['value'], nextTick, ['view-pane'], outTouch ); } )

    return { show, viewElem }; }
  }

  export default View;

</script>

<style lang="less">
     .view-pane {}
</style>



