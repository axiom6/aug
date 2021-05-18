<template>
  <div class="result-pane" ref="Result">
    <h1 v-show="myRoute()">Test Results</h1>
  </div>
</template>

<script type="module">

import { inject } from 'vue';

let Result = {

  setup() {

    const mix = inject('mix');

    const myRoute = function() {
      return mix.isRoute('Result'); }

    return { myRoute }; }
}

export default Result;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@resultFS:@themeFS;

.result-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; display:grid;
  h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@resultFS; } }

</style>