<template>
  <div class="view-pane">
    <template v-for="view in rviews">
      <router-view :name="view"></router-view>
    </template>
  </div>
</template>

<script type="module">
import { inject } from 'vue';

let View = {
  setup() {
    const mix    = inject('mix');
    const rviews = mix.routeNames();
    // console.log( 'View.setuo()', rviews );
    return { rviews }; }
}
export default View
</script>

<style lang="less">
.view-pane {}

</style>
