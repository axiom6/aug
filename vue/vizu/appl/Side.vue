<template>
    <div     class="side-pane">
      <div   class="side-sect">
        <div class="side-name">Animate</div>
        <div class="side-btns" @click="pub({animate:'start'})">Start</div>
      </div>
      <div   class="side-sect">
        <div class="side-name">Main</div>
      </div>
      <div   class="side-sect">
        <div class="side-name">Coords</div>
      </div>
      <div   class="side-sect">
        <div class="side-name">Camera</div>
      </div>
      <div   class="side-sect">
        <div class="side-name">Lights</div>
      </div>
      <div   class="side-sect">
        <div class="side-name">Content</div>
      </div>
    </div>
</template>

<script type="module">

import {inject, onMounted } from 'vue';

  let Side = {

  setup() {

    const nav   = inject('nav');
    const debug = false

    const pub  =  (obj) => {
      nav.pubVizu( obj ); }

    const onVizu =  (obj) => {
      if(debug) { console.log( "Side.onVisu()", obj ); } }

    onMounted( () => {
      nav.subscribe('Vizu', 'Dash', (obj) => { onVizu(obj); } ); } )

    return{ nav, pub };}
  }

export default Side;

</script>

<style lang="less">

  @import '../../../css/themes/theme.less';

  .side-pane { position:absolute; left:90%; top:10%; width: 10%; height:100%; color:@theme-fore; }
  .side-sect { position:relative; left:0;   top:2%;  width:100%; height: 10%; }
  .side-name { position:absolute; left: 5%; top: 0;  width:100%; height:  5%; }
  .side-btns { position:absolute; left:10%; top:50%; width: 45%; height: 30%;
    border-radius:12px; background:@theme-btns; color:black; text-align:center;
    font-size:80%; }

</style>