<template>
  <div class="replay-pane" ref="Replay">
    <h1>Replay Messages</h1>
      <h-btn name="Pubs" :doPub="doPubs" :position="[20,20,20,10]" :background="'blue'"></h-btn>
      <h-btn name="Urls" :doPub="doUrls" :position="[60,20,20,10]" :background="'blue'"></h-btn>
  </div>
</template>

<script type="module">

import { inject } from 'vue';
import Btn        from '../../base/elem/Btn.vue'
import Runner     from '../../../pub/base/nav/Runner.js'

let Replay = {

  components: { 'h-btn':Btn },

  setup() {

    const nav    = inject('nav');
    const runner = new Runner( nav, 'Muse' );

    const doPubs = () => {
      runner.doPubs( nav.pubs ); }

    const doUrls = () => {
      runner.doUrls( nav.urls ); }

    return { doPubs, doUrls }; }
}

export default Replay;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@replayFS:@themeFS;

.replay-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; display:grid;
  h1 { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@replayFS; }
  .replay-replay { position:absolute; left:20%; top:20%; width:20%; height:10%; background-color:blue;
    border-radius:12px 12px 12px 12px; }
  .replay-urlmsg { position:absolute; left:60%; top:20%; width:20%; height:10%; background-color:blue;
    border-radius:12px 12px 12px 12px; } }

</style>
