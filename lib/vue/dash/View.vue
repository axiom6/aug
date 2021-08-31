<template>
  <div ref="viewElem" class="view-pane">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">
import { inject, ref } from 'vue'; // , nextTick, onMounted

let View = {
  setup() {
    const nav    = inject('nav');
    const rviews = nav.routeNames();
    const viewElem = ref(null);

  //onMounted( () => {
  //  nav.mountTouch( "View", viewElem['value'], nextTick, ['view-pane'] ); } )

    return { rviews, viewElem }; }
}
export default View
</script>

<style lang="less">

  .view-pane {}

</style>
