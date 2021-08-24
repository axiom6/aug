
<template>
    <div   class="done-pane">
      <div class="done-title">That's All Folks</div>
    </div>
</template>

<script type="'module">

  let Done = {

    setup() {

    return {}; }

  }

  export default Done;

</script>

<style lang="less">

  @import '../../../lib/css/themes/theme.less';

  @doneFS:2.0*@themeFS;

  .done-pane {    position:absolute; left:  0; top: 0;  width:100%; height:100%; font-size:@doneFS;
    .done-title { position:absolute; left:25%; top:45%; width: 50%; height: 10%; color:@theme-fore; } }

</style>