
<template>
  <div class="test-pane" ref="Test">
    <h1>Test Replay and Result</h1>
  </div>
</template>

<script type="module">


let Test = {

  setup() {

  return {}; }
}

export default Test;

</script>

<style lang="less">

@import '../../css/themes/theme.less';

@testFS:@themeFS;

.test-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; display:grid;
  h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@testFS; } }

</style>