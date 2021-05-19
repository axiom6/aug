<template>
  <div class="replay-pane" ref="Replay">
    <h1>Publish Messages</h1>
    <div class="replay-replay" @click="doReplay()">Replay</div>
    <div class="replay-urlmsg" @click="doUrlMsg()">UrlMsg</div>
  </div>
</template>

<script type="module">

import { inject } from 'vue';
import TestMgr    from '../../../pub/base/test/TestMgr.js'

let Replay = {

  setup() {

    const nav     = inject('nav');
    const testMgr = new TestMgr( nav, 'Muse' );

    const doReplay = () => {
      testMgr.doReplay(); }

    const doUrlMsg = () => {
      testMgr.doUrlMsg(); }

    return { doReplay, doUrlMsg }; }
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
