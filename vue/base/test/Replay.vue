<template>
  <div class="replay-pane" ref="Replay">
    <h1>Replay Published Messages</h1>
  </div>
</template>

<script type="module">

import { inject } from 'vue';
import TestMgr    from '../../../pub/base/test/TestMgr.js'

let Replay = {

  setup() {

    const nav     = inject('nav');
    const testMgr = new TestMgr(nav);

    const doReplay = () => {
      testMgr.doReplay(); }

    const opReplay = () => {
      testMgr.saveReplay( 'Test', 'Muse'); }

    doReplay();
    opReplay();

    return {}; }
}

export default Replay;

</script>

<style lang="less">

@import '../../../css/themes/theme.less';

@replayFS:@themeFS;

.replay-pane { position:absolute; left:0; top:0; width:100%; height:100%;
  background-color:@theme-back; display:grid;
  h1    { justify-self:center; align-self:center; text-align:center; color:@theme-fore; font-size:2.5*@replayFS; } }

</style>

<!--
    const doReplay = async () => {
      for( const [key,obj] of Object.entries(nav.replays) ) {
        await nav.sleep( 1000 );
        if( key===false ) {}
        obj.source = 'Replay'
        nav.pub( obj, true ); } } // console.log( key, obj );

-->